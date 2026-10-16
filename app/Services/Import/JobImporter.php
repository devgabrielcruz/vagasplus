<?php

namespace App\Services\Import;

use App\Models\Category;
use App\Models\Company;
use App\Models\Platform;
use App\Rules\SafeUrl;
use App\Services\HtmlSanitizer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * Importa uma vaga a partir de um link ou de um texto colado e devolve os campos do formulário
 * do painel. Ordem: (1) dados estruturados da página (gratuito, sem IA) → (2) Gemini como reserva.
 * O resultado SEMPRE vira rascunho para revisão humana; nada é publicado por aqui.
 */
class JobImporter
{
    private const PLATFORM_HOSTS = [
        'gupy.io' => 'gupy', 'linkedin.com' => 'linkedin', 'indeed.com' => 'indeed', 'indeed.com.br' => 'indeed',
        'solides.com.br' => 'solides', 'inhire.app' => 'inhire', 'vagas.com.br' => 'vagas_com',
        'catho.com.br' => 'catho', 'infojobs.com.br' => 'infojobs',
    ];

    private const RICH = ['description', 'responsibilities', 'requirements', 'nice_to_have', 'benefits', 'additional_info'];

    public function __construct(
        private readonly PageFetcher $fetcher,
        private readonly StructuredDataExtractor $structured,
        private readonly InHireConnector $inhire,
        private readonly SectionSplitter $splitter,
        private readonly TextHeuristicExtractor $heuristics,
        private readonly GeminiExtractor $gemini,
        private readonly HtmlSanitizer $sanitizer,
    ) {}

    /**
     * @param  string  $source  link da vaga OU texto colado
     * @param  ?string  $url  link opcional para acompanhar um texto colado (detecta a plataforma e vira o link de candidatura)
     * @return array{fields: array<string, mixed>, via: string, notes: list<string>, company_match: ?array}
     */
    public function import(string $source, ?string $url = null): array
    {
        $source = trim($source);
        $url = $url !== null && trim($url) !== '' ? trim($url) : null;

        if ($source === '') {
            throw new ImportException('Cole o link ou o texto da vaga.');
        }

        // Mesma entrada = mesmo resultado (poupa a cota gratuita da IA em reimportações).
        return Cache::remember('import:v2:'.sha1($source.'|'.$url), 1800, fn () => $this->run($source, $url));
    }

    private function run(string $source, ?string $url): array
    {
        $isUrl = (bool) preg_match('#^https?://\S+$#i', $source);
        $notes = [];

        if ($isUrl) {
            $url = $source;

            // Plataformas que montam a página no navegador, mas têm API pública própria (InHire).
            if ($this->inhire->jobId($url) !== null && ($raw = $this->inhire->fetch($url)) && $this->sufficient($raw)) {
                $via = 'structured';
                $notes[] = 'Dados lidos da API pública da InHire (a mesma que a página usa), sem IA.';
            } else {
                $html = $this->fetcher->fetch($url);
                $raw = $this->structured->extract($html);
                if ($raw) {
                    $raw = $this->splitSections($raw);
                }
            }

            if (isset($via)) {
                // já resolvido pelo conector
            } elseif ($raw && $this->sufficient($raw)) {
                $via = 'structured';
                $notes[] = 'Dados lidos da própria página (padrão usado pelo Google Vagas), sem IA.';
            } else {
                $text = HtmlText::from($html);

                // Páginas que entregam o conteúdo como JSON embutido (Next.js etc.): a IA lê esse dado também.
                if (mb_strlen($text) < 800 && ($blob = HtmlText::embeddedJson($html)) !== '') {
                    $text .= "\n\nDados embutidos na página (JSON):\n".$blob;
                }

                if ($raw === null && mb_strlen($text) < 200) {
                    throw new ImportException('Esta página monta o conteúdo no navegador (como a InHire) e não pode ser lida automaticamente. Copie o texto da vaga, cole no campo de texto e mantenha o link: ele é usado para detectar a plataforma.');
                }

                [$raw, $via, $extra] = $this->fromText($text, $raw ?? []);
                $notes = [...$notes, ...$extra];
            }
        } else {
            if (mb_strlen($source) < 80) {
                throw new ImportException('O texto está muito curto. Cole o anúncio completo da vaga.');
            }

            if ($url !== null) {
                $this->fetcher->assertPublic($url); // o link só será gravado como origem; valida o formato
            }

            [$raw, $via, $extra] = $this->fromText($source, []);
            $notes = [...$notes, ...$extra];

            // Empresa costuma estar no título/og:site_name da página (ex.: <title>Quero Passagem</title> na InHire).
            if ($url !== null && empty($raw['company_name']) && ($hint = $this->companyHint($url))) {
                $raw['company_name'] = $hint;
                $notes[] = "Nome da empresa sugerido pelo título da página ({$hint}). Confirme.";
            }
        }

        $fields = $this->normalize($raw, $url);

        return [
            'fields' => $fields,
            'via' => $via,
            'notes' => [...$notes, ...$this->missingNotes($fields)],
            'company_match' => $this->companyMatch($fields['company_name'] ?? null),
        ];
    }

    /**
     * Texto → regras simples primeiro (sem IA). Com Gemini configurado, a IA refina e as regras só
     * preenchem lacunas. Sem Gemini, segue com as regras e avisa.
     *
     * @return array{0: array<string, mixed>, 1: string, 2: list<string>}
     */
    private function fromText(string $text, array $structured): array
    {
        $rules = $this->merge($structured, $this->heuristics->extract($text));

        if ($this->gemini->configured()) {
            try {
                $ai = $this->gemini->extract(mb_substr($text, 0, 16000), $this->categoryNames());

                return [$this->merge($ai, $rules), 'ai', ['A IA (Gemini) leu o conteúdo e as regras simples completaram lacunas. Confira com atenção.']];
            } catch (NotAJobPostingException $e) {
                throw $e;
            } catch (ImportException $e) {
                // Cota/erro da IA: não perde o trabalho; segue com as regras simples se houver cargo.
                if (empty($rules['title'])) {
                    throw $e;
                }

                return [$rules, 'rules', [$e->getMessage().' Usei regras simples: confira tudo com atenção.']];
            }
        }

        if (empty($rules['title'])) {
            throw new ImportException('Não consegui identificar a vaga neste texto. Ative o Gemini (GEMINI_API_KEY no .env) ou preencha manualmente.');
        }

        return [$rules, 'rules', ['Preenchido por regras simples, sem IA (cargo, seções, local, modalidade). Confira tudo; para melhor resultado, ative o Gemini.']];
    }

    private function companyHint(string $url): ?string
    {
        try {
            $dom = new \DOMDocument;
            libxml_use_internal_errors(true);
            $dom->loadHTML('<?xml encoding="utf-8"?>'.$this->fetcher->fetch($url), LIBXML_NOWARNING | LIBXML_NOERROR);
            libxml_clear_errors();

            foreach ((new \DOMXPath($dom))->query('//meta[@property="og:site_name"]/@content') as $attr) {
                if (trim($attr->nodeValue) !== '') {
                    return mb_substr(trim($attr->nodeValue), 0, 160);
                }
            }

            $title = trim((string) $dom->getElementsByTagName('title')->item(0)?->textContent);

            return $title !== '' && mb_strlen($title) <= 80 ? $title : null;
        } catch (\Throwable) {
            return null;
        }
    }

    /** Descrição estruturada em HTML com títulos → divide em seções, sem sobrescrever o que já veio separado. */
    private function splitSections(array $raw): array
    {
        $hasSections = ! empty($raw['responsibilities']) || ! empty($raw['requirements']) || ! empty($raw['benefits']);

        if ($hasSections || empty($raw['description']) || ! str_contains((string) $raw['description'], '<')) {
            return $raw;
        }

        foreach ($this->splitter->split($raw['description']) as $key => $html) {
            $raw[$key] = $html;
        }

        return $raw;
    }

    private function sufficient(array $raw): bool
    {
        return ! empty($raw['title']) && ! empty($raw['company_name']) && mb_strlen(strip_tags((string) ($raw['description'] ?? ''))) >= 80;
    }

    /** Valores do primeiro array têm prioridade; o segundo só preenche lacunas. */
    private function merge(array $structured, array $ai): array
    {
        foreach ($ai as $key => $value) {
            if (($structured[$key] ?? null) === null || $structured[$key] === '') {
                $structured[$key] = $value;
            }
        }

        return $structured;
    }

    private function normalize(array $raw, ?string $sourceUrl): array
    {
        $f = [];
        $str = fn ($v, int $max = 190) => is_string($v) && trim($v) !== '' ? mb_substr(trim(strip_tags($v)), 0, $max) : null;

        $f['title'] = $str($raw['title'] ?? null, 180);
        $f['company_name'] = $str($raw['company_name'] ?? null, 160);
        $f['city'] = $str($raw['city'] ?? null, 120);

        $state = strtoupper((string) ($raw['state'] ?? ''));
        $f['state'] = in_array($state, ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'], true) ? $state : null;

        foreach (self::RICH as $key) {
            $f[$key] = $this->sanitizer->clean(is_string($raw[$key] ?? null) ? $raw[$key] : null);
        }

        foreach (['company_website_url', 'company_logo_url'] as $key) {
            $url = $raw[$key] ?? null;
            $f[$key] = is_string($url) && SafeUrl::isSafe($url) ? $url : null;
        }

        $f['work_mode'] = in_array($raw['work_mode'] ?? null, ['remote', 'hybrid', 'onsite'], true) ? $raw['work_mode'] : null;
        if ($f['work_mode'] === null && preg_match('/\bh[ií]brid[oa]\b/iu', ($f['description'] ?? '').' '.($f['title'] ?? ''))) {
            $f['work_mode'] = 'hybrid';
        }

        $f['employment_type'] = in_array($raw['employment_type'] ?? null, ['clt', 'pj', 'internship', 'apprentice', 'temporary', 'freelance'], true) ? $raw['employment_type'] : null;
        $f['experience_level'] = in_array($raw['experience_level'] ?? null, ['intern', 'junior', 'mid', 'senior', 'lead'], true)
            ? $raw['experience_level']
            : $this->guessLevel(($f['title'] ?? '').' '.($raw['experience_text'] ?? ''));

        // Salário: só quando explícito e coerente (nunca estimado).
        $min = isset($raw['salary_min']) && is_numeric($raw['salary_min']) && $raw['salary_min'] > 0 ? round((float) $raw['salary_min'], 2) : null;
        $max = isset($raw['salary_max']) && is_numeric($raw['salary_max']) && $raw['salary_max'] > 0 ? round((float) $raw['salary_max'], 2) : null;
        if ($min !== null && $max !== null && $min > $max) {
            $max = null;
        }
        $period = in_array($raw['salary_period'] ?? null, ['hour', 'month', 'year'], true) ? $raw['salary_period'] : null;
        if (($min !== null || $max !== null) && $period !== null) {
            $f['salary_min'] = $min;
            $f['salary_max'] = $max;
            $f['salary_period'] = $period;
            $currency = strtoupper((string) ($raw['salary_currency'] ?? 'BRL'));
            $f['salary_currency'] = in_array($currency, ['BRL', 'USD', 'EUR'], true) ? $currency : 'BRL';
        }

        $f['category_id'] = $this->categoryId($raw['category'] ?? null, $raw['category_hint'] ?? null);

        // Plataforma pelo endereço; candidatura por e-mail quando a plataforma for "E-mail".
        $platform = $this->platformFor($sourceUrl);
        $email = is_string($raw['apply_email'] ?? null) && filter_var($raw['apply_email'], FILTER_VALIDATE_EMAIL) ? $raw['apply_email'] : null;
        if ($platform === null && $sourceUrl === null && $email !== null) {
            $platform = Platform::where('slug', 'email')->first();
        }
        $platform ??= Platform::where('slug', $sourceUrl ? 'company_site' : 'other')->first();

        $f['platform_id'] = $platform?->id;
        if ($platform?->uses_email) {
            $f['apply_email'] = $email;
        } else {
            $apply = $sourceUrl ?? ($raw['apply_url'] ?? null);
            $f['apply_url'] = is_string($apply) && SafeUrl::isSafe($apply, false) ? $apply : null;
        }

        if ($sourceUrl) {
            $f['source_url'] = mb_substr($sourceUrl, 0, 1000);
            $f['source_name'] = $platform?->name;
        }

        $f['source_published_at'] = $this->pastDate($raw['source_published_at'] ?? null);

        return array_filter($f, fn ($v) => $v !== null);
    }

    private function platformFor(?string $url): ?Platform
    {
        if (! $url) {
            return null;
        }

        $host = strtolower((string) parse_url($url, PHP_URL_HOST));

        foreach (self::PLATFORM_HOSTS as $domain => $slug) {
            if ($host === $domain || str_ends_with($host, '.'.$domain)) {
                return Platform::where('slug', $slug)->first();
            }
        }

        return null;
    }

    private function categoryNames(): array
    {
        return Category::query()->active()->orderBy('name')->pluck('name')->all();
    }

    private function categoryId(?string $name, ?string $hint): ?int
    {
        $categories = Category::query()->active()->get(['id', 'name']);

        foreach ([$name, $hint] as $candidate) {
            if (! $candidate) {
                continue;
            }

            $needle = mb_strtolower($candidate);
            $hit = $categories->first(fn ($c) => mb_strtolower($c->name) === $needle)
                ?? $categories->first(fn ($c) => str_contains($needle, mb_strtolower($c->name)) || str_contains(mb_strtolower($c->name), $needle));

            if ($hit) {
                return $hit->id;
            }
        }

        return null;
    }

    private function guessLevel(string $text): ?string
    {
        $t = mb_strtolower($text);

        return match (true) {
            (bool) preg_match('/\best[aá]gi|\bestagi[aá]ri/u', $t) => 'intern',
            (bool) preg_match('/\b(j[uú]nior|jr\.?|trainee)\b/u', $t) => 'junior',
            (bool) preg_match('/\b(pleno|pl\.?)\b/u', $t) => 'mid',
            (bool) preg_match('/\b(s[eê]nior|sr\.?)\b/u', $t) => 'senior',
            (bool) preg_match('/\b(l[ií]der|gerente|coordenador|coordenadora|head|lead|supervisor|supervisora)\b/u', $t) => 'lead',
            default => null,
        };
    }

    private function pastDate(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        try {
            $date = Carbon::parse($value)->setTimezone(config('app.timezone'));
        } catch (\Throwable) {
            return null;
        }

        return $date->isPast() ? $date->format('Y-m-d\TH:i') : null;
    }

    private function companyMatch(?string $name): ?array
    {
        if (! $name) {
            return null;
        }

        $company = Company::query()->whereRaw('lower(name) = ?', [mb_strtolower($name)])->first();

        return $company ? [
            'label' => $company->name,
            'logo' => $company->logo_src,
            'data' => ['website_url' => $company->website_url, 'about' => $company->about, 'logo_src' => $company->logo_src],
        ] : null;
    }

    /** @return list<string> */
    private function missingNotes(array $f): array
    {
        $notes = [];

        if (empty($f['category_id'])) {
            $notes[] = 'Categoria não identificada: selecione manualmente.';
        }
        if (empty($f['city']) && ($f['work_mode'] ?? null) !== 'remote') {
            $notes[] = 'Cidade/estado não encontrados: informe se a vaga não for remota.';
        }
        if (empty($f['salary_period'])) {
            $notes[] = 'Salário não informado na vaga (deixe em branco, nunca estime).';
        }
        if (empty($f['apply_url']) && empty($f['apply_email'])) {
            $notes[] = 'Link ou e-mail de candidatura não encontrado: informe manualmente.';
        }

        return $notes;
    }
}

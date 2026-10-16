<?php

namespace App\Services\Import;

/**
 * Lê texto colado de um anúncio SEM IA, por regras simples: cargo (primeira linha útil), seções
 * por títulos (Responsabilidades, Requisitos, Benefícios...), local, modalidade, contratação,
 * salário explícito e e-mail. Conservador: o que não for claro fica em branco.
 */
class TextHeuristicExtractor
{
    private const SECTIONS = [
        'responsibilities' => 'responsabilidades|atribui[cç][õo]es|atividades|principais atividades|o que (?:voc[eê] )?(?:vai|ir[aá]) fazer|o que voc[eê] far[aá]|seu dia a dia|no dia a dia',
        'requirements' => 'requisitos|qualifica[cç][õo]es|pr[eé]-requisitos|o que (?:buscamos|procuramos|esperamos(?: de voc[eê])?)|o que precisa(?:mos)?|perfil(?: desejado)?|conhecimentos',
        'nice_to_have' => 'diferenci(?:al|ais)|desej[aá]ve(?:l|is)|ser[aá] um diferencial|conhecimentos desej[aá]veis',
        'benefits' => 'benef[ií]cios|o que oferecemos|oferecemos|vantagens',
        'additional_info' => 'informa[cç][õo]es (?:adicionais|da vaga)|outras informa[cç][õo]es|observa[cç][õo]es|etapas do processo|processo seletivo',
        'description' => 'sobre (?:a )?(?:vaga|oportunidade|posi[cç][aã]o)|descri[cç][aã]o(?: da vaga)?|resumo da vaga|a vaga|sobre n[óo]s|quem somos',
    ];

    private const NOISE = '/^(voltar|candidatar(?:-se)?|candidate-se|inscrever(?:-se)?|compartilhar|vagas|in[ií]cio|home|menu|entrar|login|cadastr[ae]-?se|ver todas as vagas|salvar|copiar link)\b/iu';

    private const META = '/^(local|localiza[cç][aã]o|cidade|modalidade|regime|tipo de contrato|tipo de contrata[cç][aã]o|sal[aá]rio|remunera[cç][aã]o|departamento|[aá]rea|setor|n[ií]vel|senioridade|data de publica[cç][aã]o|publicada em)\s*[:\-–]/iu';

    private const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

    /** @return array<string, mixed> */
    public function extract(string $text): array
    {
        $lines = array_values(array_filter(array_map(
            fn ($l) => trim(preg_replace('/[ \t\x{00A0}]+/u', ' ', $l)),
            explode("\n", str_replace(["\r\n", "\r"], "\n", $text)),
        ), fn ($l) => $l !== ''));

        if ($lines === []) {
            return [];
        }

        [$title, $titleIndex] = $this->title($lines);
        $buckets = $this->sections(array_slice($lines, $titleIndex + 1));
        $all = implode("\n", $lines);

        $raw = [
            'title' => $title,
            'work_mode' => $this->workMode($all),
            'employment_type' => $this->employmentType($all),
            'apply_email' => $this->email($all),
        ] + $this->location($lines) + $this->salary($lines);

        foreach (array_keys(self::SECTIONS) as $key) {
            $raw[$key] = $this->html($buckets[$key] ?? [], $key === 'description');
        }

        if (empty($raw['description'])) {
            // Sem texto de abertura: usa o corpo inteiro para não perder conteúdo (o admin ajusta).
            $raw['description'] = $this->html(array_slice($lines, $titleIndex + 1, 40), true);
        }

        return $raw;
    }

    /** @return array{0: ?string, 1: int} */
    private function title(array $lines): array
    {
        foreach ($lines as $i => $line) {
            if (str_starts_with($line, 'Título da página:')) {
                continue;
            }

            if (mb_strlen($line) >= 3 && mb_strlen($line) <= 120 && ! preg_match(self::NOISE, $line) && ! $this->isHeading($line)) {
                return [rtrim($line, ' :'), $i];
            }
        }

        return [null, -1];
    }

    /** @return array<string, list<string>> */
    private function sections(array $lines): array
    {
        $buckets = [];
        $current = 'description';

        foreach ($lines as $line) {
            if (preg_match(self::NOISE, $line)) {
                continue;
            }

            if (($key = $this->headingKey($line)) !== null) {
                $current = $key;

                // "Requisitos: Superior completo" — conteúdo na mesma linha do título.
                $rest = trim((string) preg_replace('/^[^:]{1,60}:\s*/u', '', $line, 1));
                if ($rest !== '' && $rest !== $line && str_contains($line, ':')) {
                    $buckets[$current][] = $rest;
                }

                continue;
            }

            if (preg_match(self::META, $line)) {
                continue; // dados já lidos separadamente (local, salário...)
            }

            $buckets[$current][] = $line;
        }

        return $buckets;
    }

    private function isHeading(string $line): bool
    {
        return $this->headingKey($line) !== null;
    }

    /** Seção correspondente a um título (ex.: "O que você fará? 🎯" → responsibilities). */
    public function sectionKey(string $heading): ?string
    {
        return $this->headingKey($heading);
    }

    /** @return array{city?: string, state?: string} */
    public function cityAndState(string $text): array
    {
        return $this->location([$text]);
    }

    private function headingKey(string $line): ?string
    {
        // Emojis e símbolos decorativos nos títulos ("Benefícios 🎁") não contam.
        $line = trim((string) preg_replace('/[^\p{L}\p{N}\s?:\-–\/.,()]/u', '', $line));
        $clean = trim($line, " \t:-–•*#?!");

        if (mb_strlen($clean) > 70 && ! str_contains($line, ':')) {
            return null;
        }

        foreach (self::SECTIONS as $key => $pattern) {
            if (preg_match('/^(?:'.$pattern.')\b[^.!?]{0,40}$/iu', $clean) || preg_match('/^(?:'.$pattern.')\s*:/iu', $line)) {
                return $key;
            }
        }

        return null;
    }

    private function html(array $lines, bool $paragraphs): ?string
    {
        if ($lines === []) {
            return null;
        }

        $bullet = '/^(?:[-–•*·▪●◦‣✔✓➢►]|\d{1,2}[.)])\s+/u';
        $useList = ! $paragraphs && max(array_map('mb_strlen', $lines)) <= 220;

        $html = '';
        $items = [];
        $flush = function () use (&$html, &$items) {
            if ($items !== []) {
                $html .= '<ul>'.implode('', array_map(fn ($i) => '<li>'.e($i).'</li>', $items)).'</ul>';
                $items = [];
            }
        };

        foreach ($lines as $line) {
            $isBullet = (bool) preg_match($bullet, $line);

            if ($isBullet || $useList) {
                $items[] = $isBullet ? preg_replace($bullet, '', $line) : $line;

                continue;
            }

            $flush();
            $html .= '<p>'.e($line).'</p>';
        }

        $flush();

        return $html;
    }

    private function workMode(string $text): ?string
    {
        return match (true) {
            (bool) preg_match('/\bh[ií]brid[oa]\b/iu', $text) => 'hybrid',
            (bool) preg_match('/\b(?:100% ?remot[oa]|totalmente remot[oa]|trabalho remoto|home ?office|remot[oa])\b/iu', $text) => 'remote',
            (bool) preg_match('/\bpresencial\b/iu', $text) => 'onsite',
            default => null,
        };
    }

    private function employmentType(string $text): ?string
    {
        return match (true) {
            (bool) preg_match('/\bj[oó]vem aprendiz\b|\baprendiz\b/iu', $text) => 'apprentice',
            (bool) preg_match('/\best[aá]gio\b|\bestagi[aá]ri[oa]\b/iu', $text) => 'internship',
            (bool) preg_match('/\bPJ\b|pessoa jur[ií]dica/u', $text) => 'pj',
            (bool) preg_match('/\bCLT\b/u', $text) => 'clt',
            (bool) preg_match('/\bfreelanc|\bfreela\b/iu', $text) => 'freelance',
            (bool) preg_match('/tempor[aá]ri[oa]|prazo determinado|contrato (?:por prazo|tempor)/iu', $text) => 'temporary',
            default => null,
        };
    }

    private function email(string $text): ?string
    {
        return preg_match('/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/', $text, $m) && filter_var($m[0], FILTER_VALIDATE_EMAIL) ? $m[0] : null;
    }

    /** @return array{city?: string, state?: string} */
    private function location(array $lines): array
    {
        $ufs = implode('|', self::UFS);
        $candidates = [];

        foreach ($lines as $i => $line) {
            if (preg_match('/^(?:local|localiza[cç][aã]o|cidade)\s*[:\-–]\s*(.+)$/iu', $line, $m)) {
                array_unshift($candidates, $m[1]);
            } elseif ($i < 25 && mb_strlen($line) <= 80) {
                $candidates[] = $line;
            }
        }

        foreach ($candidates as $c) {
            if (preg_match('/([\p{Lu}][\p{L}\'. ]{2,40}?)\s*(?:[,\/]|\s-\s|–)\s*('.$ufs.')\b/u', $c, $m)) {
                return ['city' => trim($m[1]), 'state' => $m[2]];
            }
        }

        return [];
    }

    /** Só aceita salário com valor E periodicidade explícitos na mesma linha. */
    private function salary(array $lines): array
    {
        $num = fn (string $s) => (float) str_replace(',', '.', str_replace('.', '', $s));

        foreach ($lines as $line) {
            if (! preg_match('/R\$\s*([\d.]+(?:,\d{1,2})?)(?:\s*(?:a|à|até|-|–|e)\s*(?:R\$\s*)?([\d.]+(?:,\d{1,2})?))?/iu', $line, $m)) {
                continue;
            }

            $period = match (true) {
                (bool) preg_match('/\b(?:por|ao|\/)\s*m[eê]s\b|mensal|mensais/iu', $line) => 'month',
                (bool) preg_match('/\b(?:por|\/)\s*hora\b|\/h\b|hor[aá]ri/iu', $line) => 'hour',
                (bool) preg_match('/\b(?:por|ao|\/)\s*ano\b|anual/iu', $line) => 'year',
                default => null,
            };

            $min = $num($m[1]);
            $max = isset($m[2]) && $m[2] !== '' ? $num($m[2]) : null;

            if ($period && $min > 0 && preg_match('/sal[aá]rio|remunera|bolsa|valor|faixa|ganhos|R\$/iu', $line)) {
                return ['salary_min' => $min, 'salary_max' => $max && $max >= $min ? $max : null, 'salary_period' => $period];
            }
        }

        return [];
    }
}

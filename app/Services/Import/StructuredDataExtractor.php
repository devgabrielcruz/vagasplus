<?php

namespace App\Services\Import;

use DOMDocument;
use DOMXPath;

/**
 * Lê o JSON-LD schema.org/JobPosting que a maioria das páginas de vagas (Gupy, Greenhouse,
 * Lever, etc.) publica para o Google. Gratuito, determinístico e sem IA.
 * Devolve campos "crus"; a normalização final é feita pelo JobImporter.
 */
class StructuredDataExtractor
{
    private const UF = [
        'acre' => 'AC', 'alagoas' => 'AL', 'amapá' => 'AP', 'amazonas' => 'AM', 'bahia' => 'BA', 'ceará' => 'CE',
        'distrito federal' => 'DF', 'espírito santo' => 'ES', 'goiás' => 'GO', 'maranhão' => 'MA', 'mato grosso' => 'MT',
        'mato grosso do sul' => 'MS', 'minas gerais' => 'MG', 'pará' => 'PA', 'paraíba' => 'PB', 'paraná' => 'PR',
        'pernambuco' => 'PE', 'piauí' => 'PI', 'rio de janeiro' => 'RJ', 'rio grande do norte' => 'RN',
        'rio grande do sul' => 'RS', 'rondônia' => 'RO', 'roraima' => 'RR', 'santa catarina' => 'SC',
        'são paulo' => 'SP', 'sergipe' => 'SE', 'tocantins' => 'TO',
    ];

    public function extract(string $html): ?array
    {
        $posting = $this->findJobPosting($html);

        return $posting ? $this->map($posting) : null;
    }

    private function findJobPosting(string $html): ?array
    {
        $dom = new DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="utf-8"?>'.$html, LIBXML_NOWARNING | LIBXML_NOERROR);
        libxml_clear_errors();

        foreach ((new DOMXPath($dom))->query('//script[@type="application/ld+json"]') as $script) {
            $json = json_decode(trim(preg_replace('/^\xEF\xBB\xBF/', '', $script->textContent)), true);

            if (is_array($json) && ($found = $this->searchNode($json))) {
                return $found;
            }
        }

        return null;
    }

    private function searchNode(array $node): ?array
    {
        $type = $node['@type'] ?? null;
        $types = is_array($type) ? $type : [$type];

        if (in_array('JobPosting', $types, true)) {
            return $node;
        }

        foreach ($node as $value) {
            if (is_array($value) && ($found = $this->searchNode($value))) {
                return $found;
            }
        }

        return null;
    }

    private function map(array $j): array
    {
        $org = $j['hiringOrganization'] ?? null;
        $orgName = is_array($org) ? ($org['name'] ?? null) : $org;
        $logo = is_array($org) ? ($org['logo'] ?? null) : null;
        $address = $this->firstAddress($j['jobLocation'] ?? null);

        return [
            'title' => $this->text($j['title'] ?? null),
            'company_name' => $this->text($orgName),
            'company_website_url' => is_array($org) ? $this->text($org['sameAs'] ?? $org['url'] ?? null) : null,
            'company_logo_url' => is_array($logo) ? $this->text($logo['url'] ?? $logo['contentUrl'] ?? null) : $this->text($logo),
            'description' => $this->html($j['description'] ?? null),
            'responsibilities' => $this->html($j['responsibilities'] ?? null),
            'requirements' => $this->html($this->join([$j['qualifications'] ?? null, $j['skills'] ?? null, $j['educationRequirements'] ?? null])),
            'benefits' => $this->html($j['jobBenefits'] ?? null),
            'city' => $this->text($address['addressLocality'] ?? null),
            'state' => $this->uf($this->text($address['addressRegion'] ?? null)),
            'work_mode' => strtoupper((string) ($j['jobLocationType'] ?? '')) === 'TELECOMMUTE' ? 'remote' : null,
            'employment_type' => $this->employmentType($j['employmentType'] ?? null),
            'experience_text' => $this->text(is_array($j['experienceRequirements'] ?? null) ? ($j['experienceRequirements']['description'] ?? null) : ($j['experienceRequirements'] ?? null)),
            'category_hint' => $this->text($j['occupationalCategory'] ?? $j['industry'] ?? null),
            'source_published_at' => $this->text($j['datePosted'] ?? null),
            'apply_url' => $this->text($j['url'] ?? null),
        ] + $this->salary($j['baseSalary'] ?? null);
    }

    private function firstAddress(mixed $location): ?array
    {
        if (! is_array($location)) {
            return null;
        }

        $place = array_is_list($location) ? ($location[0] ?? null) : $location;

        return is_array($place) ? (is_array($place['address'] ?? null) ? $place['address'] : null) : null;
    }

    private function employmentType(mixed $value): ?string
    {
        foreach (is_array($value) ? $value : [$value] as $v) {
            $map = [
                'FULL_TIME' => 'clt', 'PART_TIME' => 'clt', 'CONTRACTOR' => 'pj', 'CONTRACT' => 'pj',
                'INTERN' => 'internship', 'INTERNSHIP' => 'internship', 'TEMPORARY' => 'temporary', 'VOLUNTEER' => null, 'PER_DIEM' => 'freelance',
            ];
            $key = strtoupper(str_replace([' ', '-'], '_', (string) $v));

            if (isset($map[$key])) {
                return $map[$key];
            }
        }

        return null;
    }

    private function salary(mixed $base): array
    {
        $empty = ['salary_min' => null, 'salary_max' => null, 'salary_currency' => null, 'salary_period' => null];

        if (! is_array($base)) {
            return $empty;
        }

        $value = is_array($base['value'] ?? null) ? $base['value'] : ['value' => $base['value'] ?? null];
        $min = $value['minValue'] ?? $value['value'] ?? null;
        $max = $value['maxValue'] ?? $value['value'] ?? null;
        $period = ['HOUR' => 'hour', 'MONTH' => 'month', 'YEAR' => 'year'][strtoupper((string) ($value['unitText'] ?? ''))] ?? null;

        if (! is_numeric($min) && ! is_numeric($max)) {
            return $empty;
        }

        return [
            'salary_min' => is_numeric($min) ? (float) $min : null,
            'salary_max' => is_numeric($max) ? (float) $max : null,
            'salary_currency' => $this->text($base['currency'] ?? null),
            'salary_period' => $period,
        ];
    }

    private function uf(?string $region): ?string
    {
        if ($region === null) {
            return null;
        }

        if (preg_match('/^[A-Za-z]{2}$/', $region)) {
            return strtoupper($region);
        }

        return self::UF[mb_strtolower($region)] ?? null;
    }

    private function join(array $parts): ?string
    {
        $parts = array_filter(array_map(fn ($p) => is_array($p) ? implode("\n", array_filter(array_map('strval', array_filter($p, 'is_scalar')))) : $p, $parts));

        return $parts === [] ? null : implode("\n\n", $parts);
    }

    private function text(mixed $value): ?string
    {
        if (! is_scalar($value)) {
            return null;
        }

        $text = trim(html_entity_decode(strip_tags((string) $value), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        return $text === '' ? null : $text;
    }

    /** Descrições costumam vir com HTML escapado (&lt;p&gt;). Decodifica; a sanitização vem depois. */
    private function html(mixed $value): ?string
    {
        if (! is_scalar($value) || trim((string) $value) === '') {
            return null;
        }

        $html = (string) $value;

        if (! str_contains($html, '<') && str_contains($html, '&lt;')) {
            $html = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        return $html;
    }
}

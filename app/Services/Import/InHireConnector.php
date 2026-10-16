<?php

namespace App\Services\Import;

use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * Conector da InHire. As páginas de vagas (empresa.inhire.app/vagas/{id}/...) montam o conteúdo no
 * navegador, a partir da API pública que a própria página usa (api.inhire.app, sem login). O host da API
 * é fixo e o identificador é validado, então não há risco de SSRF. Se a API mudar ou falhar, devolve
 * null e o importador segue para os outros métodos.
 */
class InHireConnector
{
    private const API = 'https://api.inhire.app/job-posts/public/pages/';

    public function __construct(private readonly SectionSplitter $splitter, private readonly TextHeuristicExtractor $rules) {}

    public function jobId(string $url): ?string
    {
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        $path = (string) parse_url($url, PHP_URL_PATH);

        if (! str_ends_with($host, '.inhire.app') || $host === 'api.inhire.app') {
            return null;
        }

        return preg_match('#^/vagas/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:/|$)#i', $path, $m) ? strtolower($m[1]) : null;
    }

    /** @return ?array<string, mixed> campos "crus" para o JobImporter */
    public function fetch(string $url): ?array
    {
        $id = $this->jobId($url);

        if ($id === null) {
            return null;
        }

        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        $tenant = substr($host, 0, -strlen('.inhire.app')); // subdomínio da empresa (ex.: queropassagem)

        try {
            $response = Http::timeout(12)->acceptJson()->withHeaders(['Origin' => 'https://'.$host, 'x-tenant' => $tenant])->get(self::API.$id);
        } catch (Throwable) {
            return null;
        }

        $j = $response->successful() ? $response->json() : null;

        if (! is_array($j) || empty($j['displayName']) || ($j['status'] ?? 'published') !== 'published') {
            return null;
        }

        $sections = $this->splitter->split((string) ($j['description'] ?? ''));
        $contract = mb_strtolower(implode(' ', (array) ($j['contractType'] ?? [])));
        $where = trim(((string) ($j['location'] ?? '')).' '.((string) ($j['locationComplement'] ?? '')));

        return [
            'title' => trim((string) $j['displayName']),
            'company_name' => trim((string) ($j['tenantName'] ?? '')) ?: null,
            'company_logo_url' => is_string($j['logo'] ?? null) ? $j['logo'] : null,
            'description' => $sections['description'] ?? (string) ($j['description'] ?? ''),
            'responsibilities' => $sections['responsibilities'] ?? null,
            'requirements' => $sections['requirements'] ?? null,
            'nice_to_have' => $sections['nice_to_have'] ?? null,
            'benefits' => $sections['benefits'] ?? null,
            'additional_info' => $sections['additional_info'] ?? null,
            'work_mode' => match (strtolower((string) ($j['workplaceType'] ?? ''))) {
                'remote' => 'remote', 'hybrid' => 'hybrid', 'onsite', 'on-site', 'on_site' => 'onsite', default => null,
            },
            'employment_type' => match (true) {
                str_contains($contract, 'tempor') => 'temporary',
                str_contains($contract, 'estágio'), str_contains($contract, 'estagio') => 'internship',
                str_contains($contract, 'aprendiz') => 'apprentice',
                str_contains($contract, 'clt') => 'clt',
                str_contains($contract, 'pj'), str_contains($contract, 'pessoa jur') => 'pj',
                str_contains($contract, 'freela'), str_contains($contract, 'autônomo'), str_contains($contract, 'autonomo') => 'freelance',
                default => null,
            },
            'source_published_at' => $j['publishedAt'] ?? null,
        ] + $this->rules->cityAndState($where);
    }
}

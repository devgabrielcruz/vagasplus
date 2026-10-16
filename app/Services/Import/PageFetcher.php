<?php

namespace App\Services\Import;

use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * Baixa uma página pública com proteção contra SSRF: só http(s) nas portas 80/443, nunca
 * IPs privados/reservados/locais (cada redirecionamento é revalidado) e o IP validado é
 * "fixado" na conexão para impedir DNS rebinding. Tamanho e tempo são limitados.
 */
class PageFetcher
{
    public const MAX_BYTES = 2_000_000;
    public const MAX_REDIRECTS = 4;

    public function fetch(string $url): string
    {
        for ($hop = 0; $hop <= self::MAX_REDIRECTS; $hop++) {
            [$host, $port, $ip] = $this->assertPublic($url);

            $options = ['allow_redirects' => false];

            if (defined('CURLOPT_RESOLVE')) {
                $options['curl'] = [CURLOPT_RESOLVE => ["{$host}:{$port}:{$ip}"]];
            }

            $options['on_headers'] = function ($response) {
                if ((int) $response->getHeaderLine('Content-Length') > self::MAX_BYTES) {
                    throw new ImportException('A página é grande demais para importar.');
                }
            };

            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; VagasPlusBot/1.0; +'.config('app.url').')',
                    'Accept' => 'text/html,application/xhtml+xml',
                    'Accept-Language' => 'pt-BR,pt;q=0.9,en;q=0.5',
                ])->timeout(12)->withOptions($options)->get($url);
            } catch (ImportException $e) {
                throw $e;
            } catch (Throwable $e) {
                throw new ImportException('Não foi possível abrir o endereço informado. Cole o texto da vaga no lugar do link.');
            }

            if (in_array($response->status(), [301, 302, 303, 307, 308], true) && $response->header('Location')) {
                $url = $this->absolute($url, $response->header('Location'));

                continue;
            }

            if ($response->status() === 403 || $response->status() === 429 || $response->status() === 401) {
                throw new ImportException('O site bloqueou a leitura automática. Copie o texto da vaga e cole aqui.');
            }

            if (! $response->successful()) {
                throw new ImportException("O endereço respondeu com erro ({$response->status()}). Confira o link ou cole o texto da vaga.");
            }

            $type = strtolower($response->header('Content-Type'));
            if ($type !== '' && ! str_contains($type, 'html') && ! str_contains($type, 'xml')) {
                throw new ImportException('O endereço não é uma página da web.');
            }

            return substr($response->body(), 0, self::MAX_BYTES);
        }

        throw new ImportException('Redirecionamentos demais ao abrir o endereço.');
    }

    /** @return array{0:string,1:int,2:string} host, porta, IP público validado */
    public function assertPublic(string $url): array
    {
        $parts = parse_url($url);
        $scheme = strtolower($parts['scheme'] ?? '');
        $host = strtolower($parts['host'] ?? '');

        if (! in_array($scheme, ['http', 'https'], true) || $host === '' || isset($parts['user']) || isset($parts['pass'])) {
            throw new ImportException('Endereço inválido. Use um link http(s) completo.');
        }

        $port = $parts['port'] ?? ($scheme === 'https' ? 443 : 80);
        if (! in_array($port, [80, 443], true)) {
            throw new ImportException('Endereço não permitido.');
        }

        $ips = filter_var(trim($host, '[]'), FILTER_VALIDATE_IP) ? [trim($host, '[]')] : $this->resolveHost($host);

        if ($ips === []) {
            throw new ImportException('Não foi possível encontrar esse endereço.');
        }

        foreach ($ips as $ip) {
            if (! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                throw new ImportException('Endereço não permitido.');
            }
        }

        return [$host, $port, $ips[0]];
    }

    /** @return list<string> */
    protected function resolveHost(string $host): array
    {
        return gethostbynamel($host) ?: [];
    }

    private function absolute(string $base, string $location): string
    {
        if (preg_match('#^https?://#i', $location)) {
            return $location;
        }

        $b = parse_url($base);
        $origin = ($b['scheme'] ?? 'https').'://'.($b['host'] ?? '').(isset($b['port']) ? ':'.$b['port'] : '');

        if (str_starts_with($location, '//')) {
            return ($b['scheme'] ?? 'https').':'.$location;
        }

        if (str_starts_with($location, '/')) {
            return $origin.$location;
        }

        return $origin.rtrim(dirname($b['path'] ?? '/'), '/').'/'.$location;
    }
}

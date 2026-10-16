<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

/**
 * Configurações operacionais editáveis no painel (/admin/configuracoes).
 */
class Settings
{
    public const DEFAULTS = [
        'default_validity_days' => 30,
        'max_validity_days' => 90,
        'contact_email' => 'contato@vagasplus.com',
        'adsense_enabled' => false,
        'adsense_client' => '',
        'adsense_slots' => [],
        'gemini_model' => '',
    ];

    /** Posições de anúncio do site → descrição exibida no painel. */
    public const AD_PLACEMENTS = [
        'home-top' => 'Home — banner logo abaixo do topo',
        'home-mid' => 'Home — banner entre categorias e vagas',
        'categories-top' => 'Categorias — banner no topo',
        'list-top' => 'Listagem — banner acima das vagas',
        'list-card' => 'Listagem — card de anúncio no meio das vagas',
        'list-card-2' => 'Listagem — segundo card de anúncio (listas longas)',
        'job-top' => 'Vaga — banner abaixo do cabeçalho',
        'job-mid' => 'Vaga — banner no meio do conteúdo',
        'job-side' => 'Vaga — bloco quadrado (300×250) abaixo de "Compartilhar"',
        'job-bottom' => 'Vaga — banner no fim da página',
    ];

    private const CACHE_KEY = 'app.settings';

    public function all(): array
    {
        // A chave do Gemini fica em linha própria, criptografada, e nunca sai daqui.
        $stored = Arr::except(
            Cache::rememberForever(self::CACHE_KEY, fn () => Setting::query()->pluck('value', 'key')->all()),
            ['gemini_api_key'],
        );

        $merged = array_merge(self::DEFAULTS, $stored);
        $merged['default_validity_days'] = (int) $merged['default_validity_days'];
        $merged['max_validity_days'] = (int) $merged['max_validity_days'];
        $merged['adsense_enabled'] = filter_var($merged['adsense_enabled'], FILTER_VALIDATE_BOOLEAN);
        $merged['adsense_slots'] = is_array($merged['adsense_slots'])
            ? $merged['adsense_slots']
            : (json_decode((string) $merged['adsense_slots'], true) ?: []);

        return $merged;
    }

    public function get(string $key): mixed
    {
        return $this->all()[$key] ?? null;
    }

    /**
     * Dados de publicidade para o site. As configurações do painel têm prioridade;
     * variáveis ADS_* do .env servem de padrão.
     */
    public function ads(): array
    {
        $all = $this->all();
        $hasPanelConfig = $all['adsense_client'] !== '';

        $client = $hasPanelConfig ? $all['adsense_client'] : (config('services.ads.client') ?: null);
        $enabled = $hasPanelConfig ? $all['adsense_enabled'] : (bool) config('services.ads.enabled');
        $slots = array_filter(array_merge((array) config('services.ads.slots'), $all['adsense_slots']));

        return [
            'enabled' => $enabled && (bool) $client,
            'client' => $client,
            'slots' => $slots,
            'demo' => (bool) config('services.ads.demo'),
        ];
    }

    /** Chave do Gemini: a salva no painel (criptografada) tem prioridade sobre o .env. */
    public function geminiKey(): ?string
    {
        $raw = Setting::query()->whereKey('gemini_api_key')->value('value');

        if ($raw) {
            try {
                return Crypt::decryptString($raw);
            } catch (\Throwable) {
                // chave de criptografia mudou: ignora o valor salvo
            }
        }

        return config('services.gemini.key') ?: null;
    }

    /** @return 'painel'|'.env'|null */
    public function geminiKeySource(): ?string
    {
        if (Setting::query()->whereKey('gemini_api_key')->exists()) {
            return 'painel';
        }

        return config('services.gemini.key') ? '.env' : null;
    }

    public function setGeminiKey(?string $key): void
    {
        if ($key === null || $key === '') {
            Setting::query()->whereKey('gemini_api_key')->delete();
        } else {
            Setting::updateOrCreate(['key' => 'gemini_api_key'], ['value' => Crypt::encryptString($key)]);
        }

        Cache::forget(self::CACHE_KEY);
    }

    public function geminiModel(): string
    {
        return (string) ($this->get('gemini_model') ?: config('services.gemini.model'));
    }

    public function update(array $values): void
    {
        foreach (array_intersect_key($values, self::DEFAULTS) as $key => $value) {
            $stored = match (true) {
                is_bool($value) => $value ? '1' : '0',
                is_array($value) => json_encode(array_filter($value), JSON_UNESCAPED_UNICODE),
                default => (string) $value,
            };

            Setting::updateOrCreate(['key' => $key], ['value' => $stored]);
        }

        Cache::forget(self::CACHE_KEY);
    }
}

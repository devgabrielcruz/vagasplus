<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/** Chamada ao Gemini usada pelos recursos públicos de IA (simulador, perguntas prováveis, compatibilidade). */
class GeminiClient
{
    private const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    public function __construct(private readonly Settings $settings) {}

    public function configured(): bool
    {
        return (string) $this->settings->geminiKey() !== '';
    }

    /**
     * Devolve o texto gerado (sem os "pensamentos" do modelo).
     *
     * @throws AssistantUnavailableException
     */
    public function generate(array $payload): string
    {
        if (! $this->configured()) {
            throw new AssistantUnavailableException('Este recurso não está disponível no momento.');
        }

        try {
            $response = Http::withHeaders(['x-goog-api-key' => (string) $this->settings->geminiKey()])
                ->timeout(45)
                ->post(sprintf(self::ENDPOINT, $this->settings->geminiModel()), $payload);
        } catch (ConnectionException) {
            throw new AssistantUnavailableException('Não foi possível falar com a IA agora. Tente novamente.');
        }

        if ($response->status() === 429) {
            throw new AssistantUnavailableException('O limite de uso da IA foi atingido por agora. Tente novamente mais tarde.', 429);
        }

        if (! $response->successful()) {
            Log::warning('Falha no Gemini (recursos públicos)', ['status' => $response->status(), 'body' => mb_substr($response->body(), 0, 300)]);

            throw new AssistantUnavailableException('A IA está indisponível no momento. Tente novamente em instantes.');
        }

        $parts = (array) data_get($response->json(), 'candidates.0.content.parts', []);
        $text = trim(implode('', array_map(fn ($p) => is_array($p) && empty($p['thought']) ? (string) ($p['text'] ?? '') : '', $parts)));

        if ($text === '') {
            throw new AssistantUnavailableException('A IA não conseguiu responder agora. Tente novamente.');
        }

        return $text;
    }

    /**
     * Como generate(), mas para respostas em JSON com esquema.
     *
     * @return array<string, mixed>
     *
     * @throws AssistantUnavailableException
     */
    public function generateJson(array $payload): array
    {
        $payload['generationConfig'] = ($payload['generationConfig'] ?? []) + ['responseMimeType' => 'application/json'];
        $json = json_decode($this->generate($payload), true);

        if (! is_array($json)) {
            throw new AssistantUnavailableException('A IA não conseguiu responder agora. Tente novamente.');
        }

        return $json;
    }
}

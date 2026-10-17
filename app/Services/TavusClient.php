<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/** Videochamada com avatar de IA (Tavus CVI). A chave fica só no servidor: o navegador recebe apenas a URL da sala. */
class TavusClient
{
    private const BASE = 'https://tavusapi.com/v2';

    public function configured(): bool
    {
        return (string) config('services.tavus.key') !== '' && (string) config('services.tavus.pal_id') !== '';
    }

    /**
     * Cria a sala e devolve o id e a URL para entrar.
     *
     * @return array{id: string, url: string}
     *
     * @throws AssistantUnavailableException
     */
    public function createConversation(string $name, string $context, string $greeting): array
    {
        if (! $this->configured()) {
            throw new AssistantUnavailableException('Este recurso não está disponível no momento.');
        }

        $faceId = (string) config('services.tavus.face_id');

        $payload = [
            'pal_id' => (string) config('services.tavus.pal_id'),
            'conversation_name' => mb_substr($name, 0, 120),
            'conversational_context' => $context,
            'custom_greeting' => $greeting,
            // Custo por minuto: sala curta, e encerra logo se ninguém entrar ou se o candidato sair.
            'properties' => [
                'max_call_duration' => max(60, (int) config('services.tavus.max_call_seconds')),
                'participant_absent_timeout' => 60,
                'participant_left_timeout' => 10,
            ],
        ] + ($faceId !== '' ? ['face_id' => $faceId] : []);

        try {
            $response = $this->http()->post(self::BASE.'/conversations', $payload);
        } catch (ConnectionException) {
            throw new AssistantUnavailableException('Não foi possível iniciar a videochamada agora. Tente novamente.');
        }

        if (in_array($response->status(), [402, 429], true)) {
            throw new AssistantUnavailableException('A entrevista por vídeo está lotada no momento. Tente novamente mais tarde.', 429);
        }

        $id = (string) $response->json('conversation_id');
        $url = (string) $response->json('conversation_url');

        if (! $response->successful() || $id === '' || $url === '') {
            Log::warning('Falha ao criar conversa na Tavus', ['status' => $response->status(), 'body' => mb_substr($response->body(), 0, 300)]);

            throw new AssistantUnavailableException('A entrevista por vídeo está indisponível no momento. Tente novamente em instantes.');
        }

        return ['id' => $id, 'url' => $url];
    }

    /** Encerra a sala (para de cobrar). Falhas não importam ao visitante: os timeouts da sala cobrem o resto. */
    public function end(string $conversationId): void
    {
        if (! $this->configured()) {
            return;
        }

        try {
            $this->http()->post(self::BASE.'/conversations/'.$conversationId.'/end');
        } catch (ConnectionException) {
        }
    }

    private function http(): PendingRequest
    {
        return Http::withHeaders(['x-api-key' => (string) config('services.tavus.key')])->timeout(20);
    }
}

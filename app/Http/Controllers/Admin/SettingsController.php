<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Import\GeminiExtractor;
use App\Services\Import\ImportException;
use App\Services\Settings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /** Modelos sugeridos (o campo aceita qualquer outro nome de modelo do Gemini). */
    public const GEMINI_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    public function edit(Settings $settings): Response
    {
        $key = $settings->geminiKey();

        return Inertia::render('Admin/Settings', [
            'settings' => $settings->all(),
            'placements' => collect(Settings::AD_PLACEMENTS)->map(fn ($label, $key) => ['key' => $key, 'label' => $label])->values(),
            // A chave nunca é enviada ao navegador: só um resumo mascarado.
            'gemini' => [
                'has_key' => (bool) $key,
                'source' => $settings->geminiKeySource(),
                'masked' => $key ? '••••••••'.substr($key, -4) : null,
                'model' => $settings->geminiModel(),
                'models' => self::GEMINI_MODELS,
            ],
        ]);
    }

    public function update(Request $request, Settings $settings): RedirectResponse
    {
        $request->merge([
            'adsense_client' => trim((string) $request->input('adsense_client')),
            'gemini_api_key' => preg_replace('/\s+/', '', (string) $request->input('gemini_api_key')),
        ]);

        $data = $request->validate([
            'default_validity_days' => ['required', 'integer', 'min:1', 'max:365'],
            'max_validity_days' => ['required', 'integer', 'min:1', 'max:365', 'gte:default_validity_days'],
            'contact_email' => ['required', 'email', 'max:190'],
            'adsense_enabled' => ['boolean'],
            'adsense_client' => [Rule::requiredIf(fn () => $request->boolean('adsense_enabled')), 'nullable', 'regex:/^ca-pub-\d{10,20}$/'],
            'adsense_slots' => ['nullable', 'array'],
            'adsense_slots.*' => ['nullable', 'regex:/^\d{6,20}$/'],
            'gemini_api_key' => ['nullable', 'regex:/^[\x21-\x7E]{20,300}$/'],
            'remove_gemini_key' => ['boolean'],
            'gemini_model' => ['nullable', 'string', 'max:80', 'regex:/^[A-Za-z0-9._\-]+$/'],
        ], [
            'adsense_client.required' => 'Informe o ID do editor para ativar o AdSense.',
            'adsense_client.regex' => 'Use o formato ca-pub-0000000000000000.',
            'adsense_slots.*.regex' => 'O ID da unidade deve conter apenas números.',
            'gemini_api_key.regex' => 'A chave do Gemini parece inválida: copie-a inteira do Google AI Studio.',
            'gemini_model.regex' => 'Use apenas o nome do modelo, como gemini-3.5-flash-lite.',
        ], [
            'default_validity_days' => 'validade padrão',
            'max_validity_days' => 'validade máxima',
            'contact_email' => 'e-mail de contato',
        ]);

        // Só aceita posições conhecidas.
        $data['adsense_slots'] = array_intersect_key($data['adsense_slots'] ?? [], Settings::AD_PLACEMENTS);
        $data['adsense_enabled'] = (bool) ($data['adsense_enabled'] ?? false);
        $data['adsense_client'] = $data['adsense_client'] ?? '';
        $data['gemini_model'] = $data['gemini_model'] ?? '';

        // Chave: em branco mantém a atual; "remover" apaga; valor novo substitui (criptografado).
        if ($request->boolean('remove_gemini_key')) {
            $settings->setGeminiKey(null);
        } elseif (! empty($data['gemini_api_key'])) {
            $settings->setGeminiKey($data['gemini_api_key']);
        }
        unset($data['gemini_api_key'], $data['remove_gemini_key']);

        $settings->update($data);

        return back()->with('success', 'Configurações salvas.');
    }

    /** Testa a chave/modelo (a digitada no formulário ou, se vazia, a salva). */
    public function testGemini(Request $request, GeminiExtractor $gemini): JsonResponse
    {
        $request->merge(['key' => preg_replace('/\s+/', '', (string) $request->input('key')) ?: null]);

        $data = $request->validate([
            'key' => ['nullable', 'regex:/^[\x21-\x7E]{20,300}$/'],
            'model' => ['nullable', 'string', 'max:80', 'regex:/^[A-Za-z0-9._\-]+$/'],
        ], [
            'key.regex' => 'A chave parece inválida: copie-a inteira, sem espaços, do Google AI Studio.',
            'model.regex' => 'Use apenas o nome do modelo, como gemini-3.5-flash-lite.',
        ]);

        try {
            $model = $gemini->ping($data['key'] ?? null, $data['model'] ?? null);

            return response()->json(['ok' => true, 'message' => "Conexão com o Gemini funcionando (modelo {$model})."]);
        } catch (ImportException $e) {
            // Resumo (tamanho e extremidades) da chave testada, para o usuário comparar com a que copiou.
            $key = $data['key'] ?? null;

            return response()->json([
                'ok' => false,
                'message' => $e->getMessage(),
                'received' => $key ? sprintf('%d caracteres, começa com "%s" e termina com "%s"', strlen($key), substr($key, 0, 3), substr($key, -3)) : null,
            ], 422);
        }
    }
}

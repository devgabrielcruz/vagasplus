<?php

namespace Tests\Feature\Admin;

use App\Models\Platform;
use App\Models\Setting;
use App\Models\User;
use App\Services\Import\PageFetcher;
use App\Services\Settings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GeminiSettingsTest extends TestCase
{
    use RefreshDatabase;

    private const KEY = 'AIzaSyTESTE_chave_de_teste_1234567890';

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
        config(['services.gemini.key' => null]);
        $this->admin = User::factory()->admin()->create();

        $this->app->bind(PageFetcher::class, fn () => new class extends PageFetcher
        {
            protected function resolveHost(string $host): array
            {
                return ['93.184.216.34'];
            }
        });

        Platform::firstOrCreate(['slug' => 'company_site'], ['name' => 'Site da empresa']);
    }

    private function base(array $extra = []): array
    {
        return array_merge(['default_validity_days' => 30, 'max_validity_days' => 90, 'contact_email' => 'a@b.com'], $extra);
    }

    private function geminiReply(array $data)
    {
        return Http::response(['candidates' => [['content' => ['parts' => [['text' => json_encode($data)]]]]]]);
    }

    public function test_key_is_stored_encrypted_and_never_sent_back_to_the_browser(): void
    {
        $this->actingAs($this->admin)->put('/admin/configuracoes', $this->base(['gemini_api_key' => self::KEY, 'gemini_model' => 'gemini-2.5-flash-lite']))
            ->assertSessionHasNoErrors();

        $stored = Setting::find('gemini_api_key')->value;
        $this->assertStringNotContainsString(self::KEY, $stored);
        $this->assertSame(self::KEY, Crypt::decryptString($stored));
        $this->assertSame(self::KEY, app(Settings::class)->geminiKey());
        $this->assertSame('gemini-2.5-flash-lite', app(Settings::class)->geminiModel());

        $page = $this->actingAs($this->admin)->get('/admin/configuracoes');
        $page->assertInertia(fn (Assert $p) => $p
            ->where('gemini.has_key', true)->where('gemini.source', 'painel')->where('gemini.masked', '••••••••7890'));
        $this->assertStringNotContainsString(self::KEY, $page->getContent());
        $this->assertStringNotContainsString($stored, $page->getContent());
    }

    public function test_keys_with_other_google_formats_and_stray_whitespace_are_accepted(): void
    {
        $newStyle = 'AQ.Ab8RN6Jx_exemplo-de-chave~nova.1234567890abcdef';

        // Espaços/quebras de linha colados junto com a chave são removidos.
        $this->actingAs($this->admin)->put('/admin/configuracoes', $this->base(['gemini_api_key' => "  ".$newStyle."\n"]))->assertSessionHasNoErrors();
        $this->assertSame($newStyle, app(Settings::class)->geminiKey());

        Http::fake(['generativelanguage.googleapis.com/*' => $this->geminiReply(['ok' => true])]);
        $this->actingAs($this->admin)->postJson('/admin/configuracoes/testar-gemini', ['key' => "\t".self::KEY." \n"])
            ->assertOk()->assertJsonPath('ok', true);
        Http::assertSent(fn (Request $r) => $r->hasHeader('x-goog-api-key', self::KEY));
    }

    public function test_blank_key_keeps_the_current_one_and_remove_deletes_it(): void
    {
        $settings = app(Settings::class);
        $settings->setGeminiKey(self::KEY);

        $this->actingAs($this->admin)->put('/admin/configuracoes', $this->base(['gemini_api_key' => '']))->assertSessionHasNoErrors();
        $this->assertSame(self::KEY, $settings->geminiKey());

        $this->actingAs($this->admin)->put('/admin/configuracoes', $this->base(['remove_gemini_key' => true]))->assertSessionHasNoErrors();
        $this->assertNull($settings->geminiKey());
        $this->assertNull($settings->geminiKeySource());
    }

    public function test_invalid_key_or_model_formats_are_rejected(): void
    {
        $this->actingAs($this->admin)->put('/admin/configuracoes', $this->base(['gemini_api_key' => 'curta']))->assertSessionHasErrors('gemini_api_key');
        $this->actingAs($this->admin)->put('/admin/configuracoes', $this->base(['gemini_api_key' => 'chave com espaços e <script> e mais de vinte']))->assertSessionHasErrors('gemini_api_key');
        $this->actingAs($this->admin)->put('/admin/configuracoes', $this->base(['gemini_model' => 'modelo errado!']))->assertSessionHasErrors('gemini_model');
        $this->actingAs($this->admin)->postJson('/admin/configuracoes/testar-gemini', ['key' => 'chave invalida'])
            ->assertStatus(422)->assertJsonPath('errors.key.0', fn ($m) => str_contains($m, 'copie-a inteira'));
        $this->assertNull(Setting::find('gemini_api_key'));
    }

    public function test_panel_key_overrides_env_and_env_is_the_fallback(): void
    {
        config(['services.gemini.key' => 'chave-do-env-xxxxxxxxxxxxxxxx']);
        $settings = app(Settings::class);

        $this->assertSame('chave-do-env-xxxxxxxxxxxxxxxx', $settings->geminiKey());
        $this->assertSame('.env', $settings->geminiKeySource());

        $settings->setGeminiKey(self::KEY);
        $this->assertSame(self::KEY, $settings->geminiKey());
        $this->assertSame('painel', $settings->geminiKeySource());
    }

    public function test_connection_test_endpoint(): void
    {
        $this->postJson('/admin/configuracoes/testar-gemini', [])->assertUnauthorized();

        $this->actingAs($this->admin)->postJson('/admin/configuracoes/testar-gemini', [])->assertStatus(422)->assertJsonPath('ok', false);

        Http::fake(['generativelanguage.googleapis.com/*' => Http::sequence()
            ->push(['candidates' => [['content' => ['parts' => [['text' => 'ok']]]]]])
            ->push(['error' => 'API key not valid'], 400)]);

        $this->actingAs($this->admin)->postJson('/admin/configuracoes/testar-gemini', ['key' => self::KEY, 'model' => 'gemini-2.5-flash'])
            ->assertOk()->assertJsonPath('ok', true);
        Http::assertSent(fn (Request $r) => str_contains($r->url(), 'models/gemini-2.5-flash:generateContent') && $r->hasHeader('x-goog-api-key', self::KEY));

        $this->actingAs($this->admin)->postJson('/admin/configuracoes/testar-gemini', ['key' => self::KEY])
            ->assertStatus(422)->assertJsonPath('ok', false)->assertJsonPath('message', fn ($m) => str_contains($m, 'chave'));
    }

    public function test_import_uses_the_key_saved_in_the_panel_for_pages_without_structured_data(): void
    {
        app(Settings::class)->setGeminiKey(self::KEY);
        Http::fake([
            'vagas.exemplo.com/*' => Http::response('<html><body><main>'.str_repeat('Vaga de vendedor com atendimento e metas de venda. ', 10).'</main></body></html>', 200),
            'generativelanguage.googleapis.com/*' => $this->geminiReply(['title' => 'Vendedor Interno', 'company_name' => 'Loja Sol', 'description' => '<p>Vender.</p>']),
        ]);

        $this->actingAs($this->admin)->postJson('/admin/vagas/importar', ['source' => 'https://vagas.exemplo.com/vendedor'])
            ->assertOk()->assertJsonPath('via', 'ai')->assertJsonPath('fields.title', 'Vendedor Interno');

        Http::assertSent(fn (Request $r) => str_contains($r->url(), 'generativelanguage') && $r->hasHeader('x-goog-api-key', self::KEY));
    }

    public function test_when_gemini_fails_the_import_still_returns_what_simple_rules_found(): void
    {
        app(Settings::class)->setGeminiKey(self::KEY);
        Http::fake([
            'vagas.exemplo.com/*' => Http::response('<html><body><h1>Analista Comercial</h1><p>'.str_repeat('Atuar na prospecção de clientes e no acompanhamento de propostas comerciais. ', 6).'</p></body></html>', 200),
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'quota'], 429),
        ]);

        $res = $this->actingAs($this->admin)->postJson('/admin/vagas/importar', ['source' => 'https://vagas.exemplo.com/comercial'])
            ->assertOk()->assertJsonPath('via', 'rules')->assertJsonPath('fields.title', 'Analista Comercial');

        $this->assertStringContainsString('limite gratuito', implode(' ', $res->json('notes')));
    }

    public function test_embedded_page_data_is_given_to_the_ai_when_the_visible_text_is_thin(): void
    {
        app(Settings::class)->setGeminiKey(self::KEY);
        $json = json_encode(['props' => ['pageProps' => ['job' => ['name' => 'Engenheiro de Dados', 'company' => 'Dados SA', 'description' => 'Construir pipelines de dados na nuvem, mantendo a qualidade dos dados, orquestrando cargas diárias, monitorando falhas e colaborando com as equipes de produto e de análise para entregar indicadores confiáveis à diretoria da empresa.']]]]);

        Http::fake([
            'carreiras.exemplo.com/*' => Http::response('<html><body><div id="__next">Carregando…</div><script id="__NEXT_DATA__" type="application/json">'.$json.'</script></body></html>', 200),
            'generativelanguage.googleapis.com/*' => $this->geminiReply(['title' => 'Engenheiro de Dados', 'company_name' => 'Dados SA', 'description' => '<p>Pipelines.</p>']),
        ]);

        $this->actingAs($this->admin)->postJson('/admin/vagas/importar', ['source' => 'https://carreiras.exemplo.com/vaga/1'])
            ->assertOk()->assertJsonPath('via', 'ai');

        Http::assertSent(fn (Request $r) => str_contains($r->url(), 'generativelanguage')
            && str_contains(json_encode($r->data(), JSON_UNESCAPED_UNICODE), 'Construir pipelines de dados na nuvem'));
    }
    public function test_pages_that_are_not_a_single_job_are_rejected_not_guessed(): void
    {
        app(Settings::class)->setGeminiKey(self::KEY);
        Http::fake([
            'boards.exemplo.com/*' => Http::response('<html><body><h1>Current openings</h1><p>'.str_repeat('Vagas abertas: Analista, Designer, Engenheiro, Gerente de produto. ', 8).'</p></body></html>', 200),
            'generativelanguage.googleapis.com/*' => $this->geminiReply(['is_job_posting' => false, 'title' => 'Current openings']),
        ]);

        $this->actingAs($this->admin)->postJson('/admin/vagas/importar', ['source' => 'https://boards.exemplo.com/vaga-encerrada'])
            ->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'não parece ser o anúncio de uma vaga'));
    }

    public function test_invalid_states_from_the_ai_are_discarded(): void
    {
        app(Settings::class)->setGeminiKey(self::KEY);
        Http::fake(['generativelanguage.googleapis.com/*' => $this->geminiReply(['is_job_posting' => true, 'title' => 'Analista', 'company_name' => 'X', 'description' => '<p>Texto da vaga.</p>', 'state' => 'BR', 'city' => 'Brasil'])]);

        $f = $this->actingAs($this->admin)->postJson('/admin/vagas/importar', ['source' => str_repeat('Anúncio de vaga para analista com texto suficiente. ', 3)])
            ->assertOk()->json('fields');

        $this->assertArrayNotHasKey('state', $f);
    }

    public function test_discontinued_models_give_a_clear_message(): void
    {
        app(Settings::class)->setGeminiKey(self::KEY);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response(['error' => ['status' => 'NOT_FOUND', 'message' => 'no longer available to new users']], 404)]);

        $this->actingAs($this->admin)->postJson('/admin/configuracoes/testar-gemini', ['model' => 'gemini-2.5-flash'])
            ->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'gemini-2.5-flash') && str_contains($m, 'Troque o modelo'));
    }
}
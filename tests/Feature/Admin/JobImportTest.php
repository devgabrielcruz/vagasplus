<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Company;
use App\Models\Platform;
use App\Models\User;
use App\Services\Import\PageFetcher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class JobImportTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
        $this->admin = User::factory()->admin()->create();

        // DNS falso e determinístico para os testes (nada de rede real).
        $this->app->bind(PageFetcher::class, fn () => new class extends PageFetcher
        {
            protected function resolveHost(string $host): array
            {
                return match ($host) {
                    'localhost' => ['127.0.0.1'],
                    'interno.example.com' => ['10.0.0.8'],
                    default => ['93.184.216.34'],
                };
            }
        });

        foreach ([['gupy', 'Gupy'], ['company_site', 'Site da empresa'], ['other', 'Outra'], ['email', 'E-mail', true]] as $p) {
            Platform::firstOrCreate(['slug' => $p[0]], ['name' => $p[1], 'uses_email' => $p[2] ?? false]);
        }
    }

    private function jsonLdPage(array $overrides = []): string
    {
        $posting = array_merge([
            '@context' => 'https://schema.org',
            '@type' => 'JobPosting',
            'title' => 'Desenvolvedor(a) Back-end Pleno',
            'description' => '&lt;p&gt;Vamos construir APIs que atendem milhões de pessoas com a equipe de plataforma.&lt;/p&gt;&lt;script&gt;alert(1)&lt;/script&gt;&lt;ul&gt;&lt;li&gt;Time remoto&lt;/li&gt;&lt;/ul&gt;',
            'datePosted' => '2026-10-01',
            'employmentType' => 'FULL_TIME',
            'hiringOrganization' => ['@type' => 'Organization', 'name' => 'Acme Tecnologia', 'sameAs' => 'https://acme.com.br', 'logo' => 'https://acme.com.br/logo.png'],
            'jobLocation' => ['@type' => 'Place', 'address' => ['addressLocality' => 'Curitiba', 'addressRegion' => 'Paraná', 'addressCountry' => 'BR']],
            'baseSalary' => ['@type' => 'MonetaryAmount', 'currency' => 'BRL', 'value' => ['minValue' => 9000, 'maxValue' => 12000, 'unitText' => 'MONTH']],
        ], $overrides);

        return '<html><head><title>Vaga</title><script type="application/ld+json">'.json_encode(['@graph' => [['@type' => 'WebSite'], $posting]]).'</script></head><body><p>x</p></body></html>';
    }

    private function geminiReply(array $data, int $status = 200)
    {
        return Http::response(['candidates' => [['content' => ['parts' => [['text' => json_encode($data)]]]]]], $status);
    }

    private function import(string $source, ?string $url = null)
    {
        return $this->actingAs($this->admin)->postJson('/admin/vagas/importar', ['source' => $source, 'url' => $url]);
    }

    public function test_it_requires_an_admin(): void
    {
        $this->postJson('/admin/vagas/importar', ['source' => 'https://x.com/vaga'])->assertUnauthorized();
        $this->actingAs(User::factory()->create())->postJson('/admin/vagas/importar', ['source' => 'https://x.com/vaga'])->assertForbidden();
    }

    public function test_structured_data_is_used_first_without_calling_ai(): void
    {
        config(['services.gemini.key' => 'chave-de-teste']);
        Http::fake(['empresa.gupy.io/*' => Http::response($this->jsonLdPage(), 200, ['Content-Type' => 'text/html'])]);
        Category::factory()->create(['name' => 'Tecnologia']);
        Company::factory()->create(['name' => 'ACME Tecnologia']);

        $res = $this->import('https://empresa.gupy.io/jobs/123')->assertOk()->assertJsonPath('via', 'structured');

        $f = $res->json('fields');
        $this->assertSame('Desenvolvedor(a) Back-end Pleno', $f['title']);
        $this->assertSame('Acme Tecnologia', $f['company_name']);
        $this->assertSame('https://acme.com.br', $f['company_website_url']);
        $this->assertSame('Curitiba', $f['city']);
        $this->assertSame('PR', $f['state']);
        $this->assertSame('clt', $f['employment_type']);
        $this->assertSame('mid', $f['experience_level']);
        $this->assertEquals(9000, $f['salary_min']);
        $this->assertEquals(12000, $f['salary_max']);
        $this->assertSame('month', $f['salary_period']);
        $this->assertSame('https://empresa.gupy.io/jobs/123', $f['apply_url']);
        $this->assertSame('https://empresa.gupy.io/jobs/123', $f['source_url']);
        $this->assertSame(Platform::where('slug', 'gupy')->value('id'), $f['platform_id']);
        $this->assertSame('2026-10-01T00:00', $f['source_published_at']);
        $this->assertStringContainsString('<li>Time remoto</li>', $f['description']);
        $this->assertStringNotContainsString('script', $f['description']);
        $this->assertSame('ACME Tecnologia', $res->json('company_match.label'));

        Http::assertNotSent(fn (Request $r) => str_contains($r->url(), 'generativelanguage'));
    }

    public function test_remote_flag_and_missing_salary_are_handled(): void
    {
        Http::fake(['*' => Http::response($this->jsonLdPage(['jobLocationType' => 'TELECOMMUTE', 'jobLocation' => null, 'baseSalary' => null]), 200)]);

        $f = $this->import('https://vagas.empresa.com/abc')->assertOk()->json('fields');

        $this->assertSame('remote', $f['work_mode']);
        $this->assertArrayNotHasKey('salary_min', $f);
        $this->assertArrayNotHasKey('salary_period', $f);
        $this->assertSame(Platform::where('slug', 'company_site')->value('id'), $f['platform_id']);
    }

    public function test_it_falls_back_to_gemini_when_the_page_has_no_structured_data(): void
    {
        config(['services.gemini.key' => 'chave-de-teste']);
        Category::factory()->create(['name' => 'Atendimento e suporte']);

        Http::fake([
            'vagas.empresa.com/*' => Http::response('<html><head><title>Vaga Suporte</title></head><body><main>'.str_repeat('Atendimento ao cliente por chat e e-mail na equipe de suporte. ', 12).'</main></body></html>', 200),
            'generativelanguage.googleapis.com/*' => $this->geminiReply([
                'title' => 'Analista de Suporte Júnior', 'company_name' => 'Loja Azul', 'work_mode' => 'hybrid', 'employment_type' => 'clt',
                'description' => '<p>Atender clientes.</p>', 'category' => 'Atendimento e suporte', 'city' => 'Recife', 'state' => 'pe',
                'salary_min' => 2500, 'salary_max' => 3000, 'salary_period' => 'month',
                // Injeção de prompt / dados ruins vindos do modelo:
                'apply_url' => 'javascript:alert(1)', 'company_website_url' => 'http://phishing', 'experience_level' => 'deus',
            ]),
        ]);

        $res = $this->import('https://vagas.empresa.com/suporte')->assertOk()->assertJsonPath('via', 'ai');
        $f = $res->json('fields');

        $this->assertSame('Analista de Suporte Júnior', $f['title']);
        $this->assertSame('hybrid', $f['work_mode']);
        $this->assertSame('PE', $f['state']);
        $this->assertSame(Category::where('name', 'Atendimento e suporte')->value('id'), $f['category_id']);
        $this->assertSame('junior', $f['experience_level']); // enum inválido descartado; nível deduzido do título
        $this->assertSame('https://vagas.empresa.com/suporte', $f['apply_url']); // nunca o link vindo do modelo
        $this->assertArrayNotHasKey('company_website_url', $f);

        Http::assertSent(fn (Request $r) => str_contains($r->url(), 'generativelanguage') && $r->hasHeader('x-goog-api-key', 'chave-de-teste')
            && str_contains(json_encode($r->data()), '<vaga>'));
    }

    public function test_pasted_text_goes_to_gemini_and_results_are_cached(): void
    {
        config(['services.gemini.key' => 'chave-de-teste']);
        Http::fake(['generativelanguage.googleapis.com/*' => $this->geminiReply([
            'title' => 'Vendedor', 'company_name' => 'Loja X', 'description' => '<p>Vender produtos.</p>', 'apply_email' => 'rh@lojax.com.br',
        ])]);

        $text = "Vendedor na Loja X. Atendimento ao cliente, vendas e organização da loja. Envie currículo para rh@lojax.com.br. Benefícios: vale-refeição.";

        $f = $this->import($text)->assertOk()->json('fields');
        $this->assertSame('Vendedor', $f['title']);
        $this->assertSame(Platform::where('slug', 'email')->value('id'), $f['platform_id']);
        $this->assertSame('rh@lojax.com.br', $f['apply_email']);
        $this->assertArrayNotHasKey('apply_url', $f);

        $this->import($text)->assertOk();
        Http::assertSentCount(1); // segunda importação veio do cache (poupa a cota gratuita)
    }

    public function test_salary_without_period_is_dropped_never_guessed(): void
    {
        config(['services.gemini.key' => 'k']);
        Http::fake(['generativelanguage.googleapis.com/*' => $this->geminiReply(['title' => 'X Y', 'company_name' => 'Z', 'description' => 'Texto longo o bastante.', 'salary_min' => 5000])]);

        $f = $this->import(str_repeat('Vaga de teste com texto suficiente para a IA analisar. ', 3))->json('fields');

        $this->assertArrayNotHasKey('salary_min', $f);
    }

    public function test_page_without_structured_data_and_without_key_falls_back_to_simple_rules_not_ai(): void
    {
        config(['services.gemini.key' => null]);
        Http::fake(['*' => Http::response('<html><body><h1>Analista Financeiro Pleno</h1><p>Atuar com contas a pagar, contas a receber e conciliação bancária em uma equipe dinâmica e colaborativa de finanças, apoiando o fechamento mensal e a elaboração de relatórios gerenciais para a diretoria da empresa.</p><h2>Requisitos</h2><ul><li>Superior completo</li><li>Excel avançado</li></ul></body></html>', 200)]);

        $res = $this->import('https://empresa.com/vaga')->assertOk()->assertJsonPath('via', 'rules');

        $this->assertSame('Analista Financeiro Pleno', $res->json('fields.title'));
        $this->assertStringContainsString('<li>Excel avançado</li>', $res->json('fields.requirements'));
        Http::assertNotSent(fn (Request $r) => str_contains($r->url(), 'generativelanguage'));
    }

    public function test_text_without_a_recognizable_title_and_without_key_explains_what_to_do(): void
    {
        config(['services.gemini.key' => null]);

        $this->import("Voltar\nCandidatar-se\n")->assertStatus(422);
        $this->import(str_repeat("Requisitos:\n", 12))->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'Não consegui identificar'));
    }

    public function test_inhire_style_pasted_text_is_read_without_ai_and_the_link_sets_the_platform(): void
    {
        config(['services.gemini.key' => null]);
        Platform::firstOrCreate(['slug' => 'inhire'], ['name' => 'InHire']);

        // A página da InHire só traz o <title> (o conteúdo é montado no navegador).
        Http::fake(['queropassagem.inhire.app/*' => Http::response('<html><head><title>Quero Passagem</title></head><body><div id="root"></div></body></html>', 200)]);

        $texto = <<<'TXT'
Voltar
Analista de Suporte Operacional - Prazo Determinado
Curitiba - PR
Híbrido
Contrato por prazo determinado

Sobre a vaga
Você vai atender usuários e parceiros da plataforma, garantindo a boa experiência de compra de passagens.

Responsabilidades
Atender chamados por chat e telefone
Registrar ocorrências no sistema
Acompanhar indicadores de qualidade

Requisitos
Ensino médio completo
Boa comunicação escrita
Experiência com atendimento ao cliente

Diferenciais
Conhecimento em transporte rodoviário

Benefícios
Vale-refeição
Plano de saúde
Salário: R$ 2.500,00 por mês
Candidatar-se
TXT;

        $res = $this->import($texto, 'https://queropassagem.inhire.app/vagas/abc/analista')->assertOk()->assertJsonPath('via', 'rules');
        $f = $res->json('fields');

        $this->assertSame('Analista de Suporte Operacional - Prazo Determinado', $f['title']);
        $this->assertSame('Curitiba', $f['city']);
        $this->assertSame('PR', $f['state']);
        $this->assertSame('hybrid', $f['work_mode']);
        $this->assertSame('temporary', $f['employment_type']);
        $this->assertStringContainsString('<p>Você vai atender usuários', $f['description']);
        $this->assertStringContainsString('<li>Registrar ocorrências no sistema</li>', $f['responsibilities']);
        $this->assertStringContainsString('<li>Boa comunicação escrita</li>', $f['requirements']);
        $this->assertStringContainsString('<li>Conhecimento em transporte rodoviário</li>', $f['nice_to_have']);
        $this->assertStringContainsString('<li>Plano de saúde</li>', $f['benefits']);
        $this->assertStringNotContainsString('Candidatar-se', $f['benefits']);
        $this->assertEquals(2500, $f['salary_min']);
        $this->assertSame('month', $f['salary_period']);
        $this->assertSame('Quero Passagem', $f['company_name']);
        $this->assertSame(Platform::where('slug', 'inhire')->value('id'), $f['platform_id']);
        $this->assertSame('https://queropassagem.inhire.app/vagas/abc/analista', $f['apply_url']);
    }

    public function test_salary_in_pasted_text_requires_an_explicit_period(): void
    {
        config(['services.gemini.key' => null]);

        $f = $this->import("Vendedor Interno\nAtender clientes na loja, organizar vitrines e repor produtos diariamente na unidade.\nSalário: R$ 3.000,00 + comissões\n")->json('fields');

        $this->assertArrayNotHasKey('salary_min', $f);
    }
    public function test_javascript_only_pages_ask_for_pasted_text(): void
    {
        config(['services.gemini.key' => 'k']);
        Http::fake(['*' => Http::response('<html><body><div id="app"></div><script>boot()</script></body></html>', 200)]);

        $this->import('https://empresa.com/spa')->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'Copie o texto'));
    }

    public function test_gemini_quota_and_key_errors_are_friendly(): void
    {
        config(['services.gemini.key' => 'k']);
        $text = str_repeat('Vaga de teste com texto suficiente para a IA analisar. ', 3);

        Http::fake(['generativelanguage.googleapis.com/*' => Http::sequence()
            ->push(['error' => 'quota'], 429)
            ->push(['error' => 'bad key'], 403)
            ->push('boom', 500)]);

        $this->import($text)->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'limite gratuito'));
        $this->import($text.' ')->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'chave'));
        $this->import($text.'  ')->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'indisponível'));
    }

    public function test_internal_and_dangerous_addresses_are_blocked_before_any_request(): void
    {
        Http::fake();

        foreach ([
            'http://localhost/admin', 'http://127.0.0.1/', 'http://10.0.0.5/x', 'http://192.168.0.1/', 'http://172.16.0.9/',
            'http://169.254.169.254/latest/meta-data/', 'http://[::1]/', 'http://interno.example.com/vaga',
            'https://empresa.com:8080/vaga', 'https://user:pass@empresa.com/vaga', 'ftp://empresa.com/vaga',
        ] as $url) {
            $this->import($url)->assertStatus(422);
        }

        // file:// e javascript: nem chegam a ser tratados como link.
        $this->import('file:///etc/passwd')->assertStatus(422);

        Http::assertNothingSent();
    }

    public function test_redirects_to_internal_hosts_are_blocked(): void
    {
        Http::fake(['empresa.com/*' => Http::response('', 302, ['Location' => 'http://169.254.169.254/latest/meta-data/'])]);

        $this->import('https://empresa.com/vaga')->assertStatus(422);

        Http::assertSentCount(1); // só a primeira requisição; o destino interno nunca é acessado
    }

    public function test_blocked_sites_suggest_pasting_the_text(): void
    {
        Http::fake(['*' => Http::response('', 403)]);

        $this->import('https://www.linkedin.com/jobs/view/123')->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'bloqueou'));
    }
    private function inhirePayload(array $overrides = []): array
    {
        return array_merge([
            'jobId' => 'a5cf8956-a995-4d12-9a35-d1bcb9c204d1',
            'status' => 'published',
            'tenantName' => 'Quero Passagem',
            'logo' => 'https://files.inhire.app/tenant-public-files/queropassagem/logo.png',
            'displayName' => ' Analista de Suporte Operacional - Prazo determinado ',
            'workplaceType' => 'Remote',
            'location' => 'BR',
            'contractType' => ['Contrato Temporário'],
            'publishedAt' => '2026-09-29T19:18:32.274Z',
            'description' => '<h3>Sobre a Quero Passagem 💙</h3><p>Somos um marketplace digital de passagens e viagens com a missão de conectar pessoas a destinos em todo o Brasil.</p>'
                .'<h3>O que voc&ecirc; far&aacute;? 🎯</h3><ul><li style="list-style-type: none;"><ul><li>Emitir passagens;</li><li>Atender parceiros;</li></ul></li></ul>'
                .'<h3>Requisitos</h3><ul><li>Experiência em atendimento;</li></ul>'
                .'<h3>Diferencial:🧐</h3><ul><li>Conhecimento de sistemas de reserva.</li></ul>'
                .'<div><h3>Benefícios incríveis para você! 🤩</h3><p>🍽️ Vale Alimentação<br>💰 Auxílio home office.</p></div><script>alert(1)</script>',
        ], $overrides);
    }

    public function test_inhire_links_are_read_through_the_public_api_without_ai(): void
    {
        config(['services.gemini.key' => 'chave-de-teste']);
        Platform::firstOrCreate(['slug' => 'inhire'], ['name' => 'InHire']);
        Http::fake(['api.inhire.app/*' => Http::response($this->inhirePayload())]);

        $url = 'https://queropassagem.inhire.app/vagas/a5cf8956-a995-4d12-9a35-d1bcb9c204d1/analista-de-suporte-operacional-prazo-determinado';
        $res = $this->import($url)->assertOk()->assertJsonPath('via', 'structured');
        $f = $res->json('fields');

        $this->assertSame('Analista de Suporte Operacional - Prazo determinado', $f['title']);
        $this->assertSame('Quero Passagem', $f['company_name']);
        $this->assertSame('remote', $f['work_mode']);
        $this->assertSame('temporary', $f['employment_type']);
        $this->assertSame('https://files.inhire.app/tenant-public-files/queropassagem/logo.png', $f['company_logo_url']);
        $this->assertSame(Platform::where('slug', 'inhire')->value('id'), $f['platform_id']);
        $this->assertSame($url, $f['apply_url']);
        $this->assertArrayNotHasKey('city', $f); // "BR" não é uma cidade

        // Seções separadas (inclusive títulos com emoji, singular e dentro de <div>) e listas achatadas.
        $this->assertStringContainsString('Somos um marketplace', $f['description']);
        $this->assertStringContainsString('<li>Emitir passagens;</li>', $f['responsibilities']);
        $this->assertStringNotContainsString('<ul><li><ul>', preg_replace('/\s+/', '', $f['responsibilities']));
        $this->assertStringContainsString('<li>Experiência em atendimento;</li>', $f['requirements']);
        $this->assertStringContainsString('Conhecimento de sistemas de reserva', $f['nice_to_have']);
        $this->assertStringContainsString('Vale Alimentação', $f['benefits']);
        $this->assertStringNotContainsString('<script', json_encode($f));

        // Só a API pública da InHire foi chamada (com o tenant); nada de IA e nada da página.
        Http::assertSent(fn (Request $r) => $r->url() === 'https://api.inhire.app/job-posts/public/pages/a5cf8956-a995-4d12-9a35-d1bcb9c204d1'
            && $r->hasHeader('x-tenant', 'queropassagem'));
        Http::assertSentCount(1);
    }

    public function test_inhire_api_failure_falls_back_to_the_normal_flow(): void
    {
        config(['services.gemini.key' => null]);
        Http::fake([
            'api.inhire.app/*' => Http::response(['message' => 'erro'], 500),
            'queropassagem.inhire.app/*' => Http::response('<html><body><div id="root"></div></body></html>', 200),
        ]);

        $this->import('https://queropassagem.inhire.app/vagas/a5cf8956-a995-4d12-9a35-d1bcb9c204d1/x')
            ->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'Copie o texto'));
    }

    public function test_only_inhire_tenant_urls_with_a_valid_job_id_use_the_connector(): void
    {
        Http::fake(['*' => Http::response('<html><body><p>'.str_repeat('Texto sem dados estruturados. ', 20).'</p></body></html>', 200)]);
        config(['services.gemini.key' => null]);

        // Outros hosts e ids inválidos nunca chamam a API da InHire.
        foreach (['https://evil.example.com/vagas/a5cf8956-a995-4d12-9a35-d1bcb9c204d1/x', 'https://api.inhire.app/vagas/a5cf8956-a995-4d12-9a35-d1bcb9c204d1', 'https://queropassagem.inhire.app/vagas/../../admin'] as $u) {
            $this->import($u);
        }

        Http::assertNotSent(fn (Request $r) => str_contains($r->url(), 'api.inhire.app/job-posts'));
    }

    public function test_structured_json_ld_descriptions_are_split_into_sections(): void
    {
        Http::fake(['*' => Http::response($this->jsonLdPage([
            'description' => '<p>Vamos construir APIs que atendem milhões de pessoas com a equipe de plataforma da empresa.</p><h3>Responsabilidades</h3><ul><li>Criar APIs</li></ul><h3>Benefícios</h3><ul><li>Plano de saúde</li></ul>',
        ]), 200)]);

        $f = $this->import('https://vagas.empresa.com/abc')->assertOk()->json('fields');

        $this->assertStringContainsString('<li>Criar APIs</li>', $f['responsibilities']);
        $this->assertStringContainsString('<li>Plano de saúde</li>', $f['benefits']);
        $this->assertStringNotContainsString('Criar APIs', $f['description']);
    }
}
<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Platform;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CompanyAndPlatformTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        Storage::fake('public');
    }

    /** PNG 1x1 real (o PHP de desenvolvimento pode não ter GD). $kb infla o arquivo para testar o limite. */
    private function png(string $name, int $kb = 0): UploadedFile
    {
        $bytes = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        $path = tempnam(sys_get_temp_dir(), 'png');
        file_put_contents($path, $bytes.str_repeat(chr(0), $kb * 1024));

        return new UploadedFile($path, $name, 'image/png', null, true);
    }

    public function test_company_pages_require_admin(): void
    {
        $this->get('/admin/empresas')->assertRedirect('/admin/login');
        $this->get('/admin/plataformas')->assertRedirect('/admin/login');
        $this->get('/admin/empresas/sugestoes?term=a')->assertRedirect('/admin/login');
    }

    public function test_admin_creates_company_with_uploaded_logo(): void
    {
        $this->actingAs($this->admin)->post('/admin/empresas', [
            'name' => 'Acme Ltda', 'website_url' => 'https://acme.com.br', 'logo' => $this->png('logo.png'),
        ])->assertSessionHasNoErrors();

        $company = Company::firstOrFail();
        $this->assertSame('acme-ltda', $company->slug);
        Storage::disk('public')->assertExists($company->logo_path);
        $this->assertStringContainsString('/storage/logos/companies/', $company->logo_src);
    }

    public function test_company_logo_rejects_svg_and_oversized_files_and_duplicate_names(): void
    {
        Company::factory()->create(['name' => 'Acme Ltda']);

        $this->actingAs($this->admin)->post('/admin/empresas', ['name' => 'acme ltda'])->assertSessionHasErrors('name');
        $this->actingAs($this->admin)->post('/admin/empresas', ['name' => 'Outra', 'logo' => UploadedFile::fake()->create('x.svg', 5, 'image/svg+xml')])->assertSessionHasErrors('logo');
        $this->actingAs($this->admin)->post('/admin/empresas', ['name' => 'Outra', 'logo' => $this->png('big.png', 2048)])->assertSessionHasErrors('logo');
    }

    public function test_replacing_and_removing_a_logo_deletes_the_old_file(): void
    {
        $this->actingAs($this->admin)->post('/admin/empresas', ['name' => 'Acme', 'logo' => $this->png('a.png')]);
        $company = Company::firstOrFail();
        $old = $company->logo_path;

        $this->actingAs($this->admin)->put("/admin/empresas/{$company->id}", ['name' => 'Acme', 'logo' => $this->png('b.png')]);
        Storage::disk('public')->assertMissing($old);
        $new = $company->fresh()->logo_path;
        Storage::disk('public')->assertExists($new);

        $this->actingAs($this->admin)->put("/admin/empresas/{$company->id}", ['name' => 'Acme', 'remove_logo' => true]);
        Storage::disk('public')->assertMissing($new);
        $this->assertNull($company->fresh()->logo_src);
    }

    public function test_company_with_jobs_cannot_be_deleted(): void
    {
        $job = JobPosting::factory()->create();

        $this->actingAs($this->admin)->delete("/admin/empresas/{$job->company_id}")->assertSessionHas('error');
        $this->assertDatabaseHas('companies', ['id' => $job->company_id]);

        $free = Company::factory()->create();
        $this->actingAs($this->admin)->delete("/admin/empresas/{$free->id}");
        $this->assertDatabaseMissing('companies', ['id' => $free->id]);
    }

    public function test_company_suggestions_for_the_job_form(): void
    {
        Company::factory()->create(['name' => 'Exemplo Tech']);
        Company::factory()->create(['name' => 'Outra Empresa']);

        $this->actingAs($this->admin)->getJson('/admin/empresas/sugestoes?term=exem')
            ->assertOk()->assertJsonCount(1, 'items')->assertJsonPath('items.0.label', 'Exemplo Tech');
    }

    public function test_creating_a_job_reuses_an_existing_company_or_creates_a_new_one_with_logo(): void
    {
        $existing = Company::factory()->create(['name' => 'Exemplo Tech']);
        $payload = [
            'action' => 'save', 'title' => 'Dev', 'description' => '<p>x</p>', 'work_mode' => 'remote', 'employment_type' => 'clt',
            'category_id' => Category::factory()->create()->id, 'platform_id' => Platform::factory()->create()->id, 'apply_url' => 'https://x.com/a',
        ];

        $this->actingAs($this->admin)->post('/admin/vagas', $payload + ['company_name' => 'exemplo tech'])->assertSessionHasNoErrors();
        $this->assertDatabaseCount('companies', 1);
        $this->assertSame($existing->id, JobPosting::firstOrFail()->company_id);

        $this->actingAs($this->admin)->post('/admin/vagas', $payload + [
            'company_name' => 'Empresa Nova', 'company_logo' => $this->png('n.png'), 'company_website_url' => 'https://nova.com.br',
        ])->assertSessionHasNoErrors();

        $new = Company::where('name', 'Empresa Nova')->firstOrFail();
        Storage::disk('public')->assertExists($new->logo_path);
        $this->assertSame('https://nova.com.br', $new->website_url);
    }

    public function test_admin_manages_platforms_and_cannot_delete_one_in_use(): void
    {
        $this->actingAs($this->admin)->post('/admin/plataformas', [
            'name' => 'Nova RH', 'color' => '#112233', 'uses_email' => false, 'is_active' => true,
            'logo' => $this->png('p.png'),
        ])->assertSessionHasNoErrors();

        $platform = Platform::where('name', 'Nova RH')->firstOrFail();
        $this->assertSame('nova-rh', $platform->slug);
        Storage::disk('public')->assertExists($platform->logo_path);

        $this->actingAs($this->admin)->post('/admin/plataformas', ['name' => 'Ruim', 'color' => 'azul'])->assertSessionHasErrors('color');

        JobPosting::factory()->create(['platform_id' => $platform->id]);
        $this->actingAs($this->admin)->delete("/admin/plataformas/{$platform->id}")->assertSessionHas('error');
        $this->assertDatabaseHas('platforms', ['id' => $platform->id]);
    }
}
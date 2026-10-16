<?php

namespace Tests\Feature;

use App\Enums\JobStatus;
use App\Models\Category;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\JobSubmission;
use App\Models\Platform;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SubmissionFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    private function png(): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'png');
        file_put_contents($path, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='));

        return new UploadedFile($path, 'logo.png', 'image/png', null, true);
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'submitter_name' => 'Maria Souza',
            'submitter_email' => 'maria@empresa.com.br',
            'company_name' => 'Empresa Nova Ltda',
            'title' => 'Analista de Suporte',
            'category_id' => Category::factory()->create()->id,
            'work_mode' => 'remote',
            'employment_type' => 'clt',
            'description' => 'Atender clientes por chat e e-mail, registrando os chamados no sistema interno.',
            'platform_id' => Platform::firstOrCreate(['slug' => 'gupy'], ['name' => 'Gupy'])->id,
            'apply_url' => 'https://empresa.gupy.io/vaga/1',
            'authorized' => true,
        ], $overrides);
    }

    public function test_submission_page_is_public(): void
    {
        Category::factory()->create();
        Platform::factory()->create();

        $this->get('/publicar-vaga')->assertOk()->assertInertia(fn (Assert $p) => $p
            ->component('Public/SubmitJob')->has('categories', 1)->has('platforms', 1));
    }

    public function test_visitor_submission_is_saved_as_pending_and_never_published(): void
    {
        $this->post('/publicar-vaga', $this->payload(['company_logo' => $this->png()]))->assertRedirect('/publicar-vaga/enviado');

        $submission = JobSubmission::firstOrFail();
        $this->assertSame('pending', $submission->status);
        $this->assertSame('Empresa Nova Ltda', $submission->company_name);
        Storage::disk('public')->assertExists($submission->company_logo_path);
        $this->assertDatabaseCount('job_postings', 0);
        $this->assertDatabaseCount('companies', 0);

        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 0));
    }

    public function test_thank_you_page_only_after_a_submission(): void
    {
        $this->get('/publicar-vaga/enviado')->assertRedirect('/publicar-vaga');

        $this->post('/publicar-vaga', $this->payload());
        $this->get('/publicar-vaga/enviado')->assertOk()->assertInertia(fn (Assert $p) => $p->component('Public/SubmitJobDone'));
    }

    public function test_validation_rules(): void
    {
        $this->post('/publicar-vaga', [])->assertSessionHasErrors(['submitter_name', 'submitter_email', 'company_name', 'title', 'category_id', 'description', 'platform_id', 'authorized']);

        $this->post('/publicar-vaga', $this->payload(['apply_url' => 'javascript:alert(1)']))->assertSessionHasErrors('apply_url');
        $this->post('/publicar-vaga', $this->payload(['work_mode' => 'onsite']))->assertSessionHasErrors(['city', 'state']);
        $this->post('/publicar-vaga', $this->payload(['authorized' => false]))->assertSessionHasErrors('authorized');
        $this->post('/publicar-vaga', $this->payload(['category_id' => Category::factory()->create(['is_active' => false])->id]))->assertSessionHasErrors('category_id');
        $this->post('/publicar-vaga', $this->payload(['platform_id' => Platform::factory()->create(['is_active' => false])->id]))->assertSessionHasErrors('platform_id');
        $this->assertDatabaseCount('job_submissions', 0);
    }

    public function test_email_platform_needs_email_instead_of_link(): void
    {
        $email = Platform::factory()->email()->create();

        $this->post('/publicar-vaga', $this->payload(['platform_id' => $email->id, 'apply_url' => null]))->assertSessionHasErrors('apply_email');
        $this->post('/publicar-vaga', $this->payload(['platform_id' => $email->id, 'apply_url' => 'https://x.com', 'apply_email' => 'rh@empresa.com.br']))
            ->assertSessionDoesntHaveErrors();

        $submission = JobSubmission::firstOrFail();
        $this->assertNull($submission->apply_url);
        $this->assertSame('rh@empresa.com.br', $submission->apply_email);
    }

    public function test_html_is_sanitized_on_submission(): void
    {
        $this->post('/publicar-vaga', $this->payload(['description' => '<p onclick="x()">Texto válido da vaga com mais de trinta caracteres.</p><script>alert(1)</script>']));

        $description = JobSubmission::firstOrFail()->description;
        $this->assertStringNotContainsString('script', $description);
        $this->assertStringNotContainsString('onclick', $description);
    }

    public function test_honeypot_pretends_success_without_saving(): void
    {
        $this->post('/publicar-vaga', $this->payload(['website_confirm' => 'http://spam.com']))->assertRedirect();

        $this->assertDatabaseCount('job_submissions', 0);
    }

    public function test_submissions_are_rate_limited_per_visitor(): void
    {
        foreach (range(1, 6) as $i) {
            $this->post('/publicar-vaga', $this->payload(['title' => "Vaga {$i}"]))->assertRedirect();
        }

        $this->post('/publicar-vaga', $this->payload(['title' => 'Vaga 7']))->assertStatus(429);
    }

    public function test_admin_pages_require_admin(): void
    {
        $submission = JobSubmission::factory()->create();

        $this->get('/admin/solicitacoes')->assertRedirect('/admin/login');
        $this->get("/admin/solicitacoes/{$submission->id}")->assertRedirect('/admin/login');
        $this->post("/admin/solicitacoes/{$submission->id}/aprovar")->assertRedirect('/admin/login');
        $this->actingAs(User::factory()->create())->get('/admin/solicitacoes')->assertForbidden();
    }

    public function test_admin_sees_pending_submissions_and_count(): void
    {
        JobSubmission::factory()->count(2)->create();
        JobSubmission::factory()->create(['status' => 'rejected']);
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get('/admin/solicitacoes')->assertInertia(fn (Assert $p) => $p
            ->has('submissions.data', 2)->where('status', 'pending')->where('pendingSubmissions', 2));
        $this->actingAs($admin)->get('/admin/solicitacoes?status=rejected')->assertInertia(fn (Assert $p) => $p->has('submissions.data', 1));
        $this->actingAs($admin)->get('/admin')->assertInertia(fn (Assert $p) => $p->where('stats.submissions', 2));
    }

    public function test_approval_creates_a_draft_job_and_reuses_company_and_logo(): void
    {
        $admin = User::factory()->admin()->create();
        $this->post('/publicar-vaga', $this->payload(['company_logo' => $this->png()]));
        $submission = JobSubmission::firstOrFail();

        $this->actingAs($admin)->post("/admin/solicitacoes/{$submission->id}/aprovar")->assertRedirect();

        $job = JobPosting::firstOrFail();
        $this->assertSame(JobStatus::Draft, $job->status);
        $this->assertTrue($job->needs_review);
        $this->assertSame('Analista de Suporte', $job->title);
        $this->assertSame('Empresa Nova Ltda', $job->company->name);
        Storage::disk('public')->assertExists($job->company->logo_path);

        $submission->refresh();
        $this->assertSame('approved', $submission->status);
        $this->assertSame($job->id, $submission->job_posting_id);
        $this->assertSame($admin->id, $submission->reviewed_by);

        // Aprovar não publica: continua invisível ao público.
        $this->get('/vagas/'.$job->slug)->assertNotFound();
    }

    public function test_approval_reuses_an_existing_company(): void
    {
        $company = Company::factory()->create(['name' => 'Empresa Nova Ltda']);
        $submission = JobSubmission::factory()->create(['company_name' => 'empresa nova ltda']);

        $this->actingAs(User::factory()->admin()->create())->post("/admin/solicitacoes/{$submission->id}/aprovar");

        $this->assertDatabaseCount('companies', 1);
        $this->assertSame($company->id, JobPosting::firstOrFail()->company_id);
    }

    public function test_rejection_requires_reason_and_removes_the_uploaded_logo(): void
    {
        $admin = User::factory()->admin()->create();
        $this->post('/publicar-vaga', $this->payload(['company_logo' => $this->png()]));
        $submission = JobSubmission::firstOrFail();
        $logo = $submission->company_logo_path;

        $this->actingAs($admin)->post("/admin/solicitacoes/{$submission->id}/recusar", [])->assertSessionHasErrors('reason');

        $this->actingAs($admin)->post("/admin/solicitacoes/{$submission->id}/recusar", ['reason' => 'Vaga sem informações suficientes.'])
            ->assertRedirect('/admin/solicitacoes');

        $submission->refresh();
        $this->assertSame('rejected', $submission->status);
        $this->assertSame('Vaga sem informações suficientes.', $submission->rejection_reason);
        Storage::disk('public')->assertMissing($logo);
        $this->assertDatabaseCount('job_postings', 0);
    }

    public function test_a_reviewed_submission_cannot_be_reviewed_again(): void
    {
        $admin = User::factory()->admin()->create();
        $submission = JobSubmission::factory()->create(['status' => 'rejected']);

        $this->actingAs($admin)->post("/admin/solicitacoes/{$submission->id}/aprovar")->assertSessionHasErrors('status');
        $this->actingAs($admin)->post("/admin/solicitacoes/{$submission->id}/recusar", ['reason' => 'Outro motivo'])->assertSessionHasErrors('status');
        $this->assertDatabaseCount('job_postings', 0);
    }
}

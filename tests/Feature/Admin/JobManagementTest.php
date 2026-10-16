<?php

namespace Tests\Feature\Admin;

use App\Enums\JobStatus;
use App\Models\Category;
use App\Models\JobPosting;
use App\Models\Platform;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class JobManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'action' => 'save',
            'title' => 'Analista de Suporte Remoto',
            'company_name' => 'Empresa Exemplo',
            'description' => '<p>Atender clientes.</p>',
            'category_id' => Category::factory()->create()->id,
            'work_mode' => 'remote',
            'employment_type' => 'clt',
            'platform_id' => Platform::firstOrCreate(['slug' => 'gupy'], ['name' => 'Gupy'])->id,
            'apply_url' => 'https://empresa.gupy.io/vaga/1',
        ], $overrides);
    }

    public function test_creating_a_draft_does_not_publish_it(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload())->assertRedirect();

        $job = JobPosting::firstOrFail();
        $this->assertSame(JobStatus::Draft, $job->status);
        $this->assertNull($job->published_at);
        $this->assertMatchesRegularExpression('/^analista-de-suporte-remoto-empresa-exemplo-[a-z0-9]{6}$/', $job->slug);
        $this->get('/vagas/'.$job->slug)->assertNotFound();
        $this->assertDatabaseHas('job_posting_events', ['job_posting_id' => $job->id, 'event' => 'created']);
    }

    public function test_publishing_uses_validity_preset_and_makes_job_public(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['action' => 'publish', 'validity_days' => 15]))->assertRedirect();

        $job = JobPosting::firstOrFail();
        $this->assertSame(JobStatus::Published, $job->status);
        $this->assertEqualsWithDelta(15, now()->diffInDays($job->expires_at), 1);
        $this->get('/vagas/'.$job->slug)->assertOk();
    }

    public function test_publishing_without_validity_uses_the_configured_default(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['action' => 'publish']))->assertRedirect();

        $this->assertEqualsWithDelta(30, now()->diffInDays(JobPosting::firstOrFail()->expires_at), 1);
    }

    public function test_scheduling_requires_a_future_date_and_keeps_job_hidden(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['action' => 'schedule', 'publish_at' => now()->subDay()->format('Y-m-d H:i')]))
            ->assertSessionHasErrors('publish_at');
        $this->assertDatabaseCount('job_postings', 0);

        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload([
            'action' => 'schedule',
            'publish_at' => now()->addDays(3)->format('Y-m-d H:i'),
            'validity_days' => 30,
        ]))->assertRedirect();

        $job = JobPosting::firstOrFail();
        $this->assertSame(JobStatus::Scheduled, $job->status);
        $this->get('/vagas/'.$job->slug)->assertNotFound();
    }

    public function test_expiration_before_publication_is_rejected_and_nothing_is_saved(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload([
            'action' => 'publish',
            'expires_at' => now()->subDay()->format('Y-m-d H:i'),
        ]))->assertSessionHasErrors('expires_at');

        $this->assertDatabaseCount('job_postings', 0);
    }

    public function test_validity_above_the_configured_maximum_is_rejected(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['action' => 'publish', 'validity_days' => 120]))
            ->assertSessionHasErrors('expires_at');
    }

    public function test_duplicate_titles_get_distinct_slugs_and_duplicate_manual_slug_is_rejected(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload())->assertRedirect();
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload())->assertRedirect();

        $slugs = JobPosting::pluck('slug');
        $this->assertCount(2, $slugs->unique());

        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['slug' => $slugs->first()]))
            ->assertSessionHasErrors('slug');
        $this->assertDatabaseCount('job_postings', 2);
    }

    public function test_editing_does_not_change_slug_or_lifecycle(): void
    {
        $job = JobPosting::factory()->create();
        $slug = $job->slug;
        $publishedAt = $job->published_at;
        $expiresAt = $job->expires_at;

        $this->actingAs($this->admin)->put("/admin/vagas/{$job->id}", $this->payload([
            'title' => 'Título Totalmente Novo',
            'category_id' => $job->category_id,
            'expires_at' => now()->addDays(80)->format('Y-m-d H:i'),
            'status' => 'draft',
        ]))->assertRedirect();

        $job->refresh();
        $this->assertSame('Título Totalmente Novo', $job->title);
        $this->assertSame($slug, $job->slug);
        $this->assertSame(JobStatus::Published, $job->status);
        $this->assertTrue($job->published_at->equalTo($publishedAt));
        $this->assertTrue($job->expires_at->equalTo($expiresAt));
    }

    public function test_unsafe_urls_are_rejected(): void
    {
        foreach (['javascript:alert(1)', 'data:text/html,hi', 'ftp://x.com/a', '//evil.com', 'https://user:pass@x.com'] as $url) {
            $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['apply_url' => $url]))
                ->assertSessionHasErrors('apply_url');
        }

        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['company_logo_url' => 'javascript:alert(1)']))
            ->assertSessionHasErrors('company_logo_url');
        $this->assertDatabaseCount('job_postings', 0);
    }

    public function test_email_platform_needs_an_email_and_drops_any_link(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['platform_id' => Platform::factory()->email()->create()->id, 'apply_url' => null]))
            ->assertSessionHasErrors('apply_email');

        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload([
            'platform_id' => Platform::where('slug', 'email')->value('id'), 'apply_url' => 'https://ignorada.com', 'apply_email' => 'rh@empresa.com.br', 'action' => 'publish',
        ]))->assertSessionDoesntHaveErrors();

        $job = JobPosting::firstOrFail();
        $this->assertNull($job->apply_url);
        $this->get('/vagas/'.$job->slug)->assertInertia(fn (Assert $p) => $p
            ->where('job.apply_url', null)->where('job.apply_email', 'rh@empresa.com.br')->where('job.platform.value', 'email'));
    }

    public function test_link_platforms_require_a_safe_url(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['apply_url' => null]))
            ->assertSessionHasErrors('apply_url');
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['platform_id' => 99999]))
            ->assertSessionHasErrors('platform_id');
    }

    public function test_html_content_is_sanitized(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload([
            'description' => '<p onclick="x()">Olá</p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">mal</a><a href="https://ok.com">bom</a>',
        ]))->assertRedirect();

        $description = JobPosting::firstOrFail()->description;

        $this->assertStringContainsString('<p>Olá</p>', $description);
        $this->assertStringNotContainsString('script', $description);
        $this->assertStringNotContainsString('onerror', $description);
        $this->assertStringNotContainsString('onclick', $description);
        $this->assertStringNotContainsString('javascript:', $description);
        $this->assertStringContainsString('href="https://ok.com"', $description);
        $this->assertStringContainsString('rel="noopener noreferrer nofollow ugc"', $description);
    }

    public function test_non_remote_jobs_require_a_location(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['work_mode' => 'onsite']))
            ->assertSessionHasErrors(['city', 'state']);

        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['work_mode' => 'onsite', 'city' => 'Curitiba', 'state' => 'pr']))
            ->assertSessionDoesntHaveErrors();

        $this->assertDatabaseHas('locations', ['city' => 'Curitiba', 'state' => 'PR']);
    }

    public function test_status_cannot_be_forged_through_mass_assignment(): void
    {
        $this->actingAs($this->admin)->post('/admin/vagas', $this->payload(['status' => 'published', 'published_at' => now()->toDateTimeString()]))
            ->assertRedirect();

        $this->assertSame(JobStatus::Draft, JobPosting::firstOrFail()->status);
    }

    public function test_archive_and_restore_flow(): void
    {
        $job = JobPosting::factory()->create();

        $this->actingAs($this->admin)->post("/admin/vagas/{$job->id}/arquivar")->assertRedirect();
        $this->assertSame(JobStatus::Archived, $job->fresh()->status);
        $this->get('/vagas/'.$job->slug)->assertStatus(410);

        $this->actingAs($this->admin)->post("/admin/vagas/{$job->id}/restaurar")->assertRedirect();
        $this->assertSame(JobStatus::Draft, $job->fresh()->status);
        $this->get('/vagas/'.$job->slug)->assertNotFound();
    }

    public function test_renew_endpoint_requires_confirmation_for_expired_jobs(): void
    {
        $job = JobPosting::factory()->expired()->create();

        $this->actingAs($this->admin)->post("/admin/vagas/{$job->id}/renovar", ['validity_days' => 30])
            ->assertSessionHasErrors('confirm');
        $this->assertSame(JobStatus::Expired, $job->fresh()->status);

        $this->actingAs($this->admin)->post("/admin/vagas/{$job->id}/renovar", ['validity_days' => 30, 'confirm' => true])
            ->assertSessionHasNoErrors();

        $this->assertSame(JobStatus::Published, $job->fresh()->status);
        $this->get('/vagas/'.$job->slug)->assertInertia(fn (Assert $p) => $p->where('closed', false));
    }

    public function test_preview_of_a_draft_is_authenticated_and_noindex(): void
    {
        $job = JobPosting::factory()->draft()->create();

        $this->get("/admin/vagas/{$job->id}/preview")->assertRedirect('/admin/login');

        $this->actingAs($this->admin)->get("/admin/vagas/{$job->id}/preview")
            ->assertOk()
            ->assertHeader('X-Robots-Tag', 'noindex, nofollow')
            ->assertInertia(fn (Assert $p) => $p->where('preview', true)->where('seo.robots', 'noindex,nofollow')->where('seo.json_ld', null));
    }

    public function test_admin_list_filters_by_effective_status_search_and_paginates(): void
    {
        JobPosting::factory()->create(['title' => 'Alpha Ativa']);
        JobPosting::factory()->stale()->create(['title' => 'Beta Vencida']);
        JobPosting::factory()->draft()->create(['title' => 'Gama Rascunho']);
        JobPosting::factory()->count(25)->draft()->create();

        $this->actingAs($this->admin)->get('/admin/vagas?status=expired')
            ->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1)->where('jobs.data.0.title', 'Beta Vencida')->where('jobs.data.0.status', 'expired'));

        $this->actingAs($this->admin)->get('/admin/vagas?status=published')
            ->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1)->where('jobs.data.0.title', 'Alpha Ativa'));

        $this->actingAs($this->admin)->get('/admin/vagas?q=Gama')
            ->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1));

        $this->actingAs($this->admin)->get('/admin/vagas')
            ->assertInertia(fn (Assert $p) => $p->has('jobs.data', 20)->where('jobs.total', 28)->where('jobs.last_page', 2));
    }

    public function test_dashboard_shows_real_counts(): void
    {
        JobPosting::factory()->count(2)->create();
        JobPosting::factory()->create(['expires_at' => now()->addDays(3)]);
        JobPosting::factory()->draft()->create();
        JobPosting::factory()->scheduled()->create();
        JobPosting::factory()->expired()->create(['expires_at' => now()->subDays(2)]);
        JobPosting::factory()->archived()->create();

        $this->actingAs($this->admin)->get('/admin')->assertInertia(fn (Assert $p) => $p
            ->where('stats.active', 3)
            ->where('stats.draft', 1)
            ->where('stats.scheduled', 1)
            ->where('stats.expiring_soon', 1)
            ->where('stats.expired', 1)
            ->where('stats.recently_expired', 1)
            ->where('stats.archived', 1));
    }
}

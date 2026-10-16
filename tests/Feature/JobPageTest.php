<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Location;
use App\Support\JobPostingSchema;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class JobPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_apply_button_uses_the_registered_url(): void
    {
        $job = JobPosting::factory()->create(['apply_url' => 'https://empresa.gupy.io/jobs/123?utm=vagasplus']);

        $this->get('/vagas/'.$job->slug)->assertInertia(fn (Assert $p) => $p
            ->where('job.apply_url', 'https://empresa.gupy.io/jobs/123?utm=vagasplus')
            ->where('job.apply_host', 'empresa.gupy.io'));
    }

    public function test_expired_job_page_is_a_closure_page_without_apply_url_or_structured_data(): void
    {
        $job = JobPosting::factory()->expired()->create();
        JobPosting::factory()->create(['category_id' => $job->category_id, 'title' => 'Vaga Semelhante']);

        $this->get('/vagas/'.$job->slug)
            ->assertOk()
            ->assertInertia(fn (Assert $p) => $p
                ->component('Public/JobShow')
                ->where('closed', true)
                ->where('job.apply_url', null)
                ->where('seo.robots', 'noindex,follow')
                ->where('seo.json_ld', null)
                ->has('related', 1)
                ->where('related.0.title', 'Vaga Semelhante'));
    }

    public function test_job_that_expired_by_the_clock_is_closed_even_before_the_scheduler_runs(): void
    {
        $job = JobPosting::factory()->stale()->create();

        $this->get('/vagas/'.$job->slug)->assertInertia(fn (Assert $p) => $p
            ->where('closed', true)->where('job.apply_url', null)->where('seo.json_ld', null));
    }

    public function test_active_job_emits_job_posting_structured_data_matching_visible_data(): void
    {
        $job = JobPosting::factory()->withSalary(3000, 5000)->create([
            'title' => 'Analista de Dados',
            'company_id' => Company::factory()->create(['name' => 'Acme Ltda']),
            'location_id' => Location::factory()->create(['city' => 'Curitiba', 'state' => 'PR']),
        ]);

        $response = $this->get('/vagas/'.$job->slug);

        $response->assertInertia(fn (Assert $p) => $p
            ->where('seo.robots', 'index,follow')
            ->where('seo.canonical', route('jobs.show', $job->slug))
            ->where('job.salary', 'R$ 3.000 – R$ 5.000 por mês'));

        $schema = json_decode($response->viewData('page')['props']['seo']['json_ld'], true);

        $this->assertSame('JobPosting', $schema['@type']);
        $this->assertSame('Analista de Dados', $schema['title']);
        $this->assertSame('Acme Ltda', $schema['hiringOrganization']['name']);
        $this->assertSame('Curitiba', $schema['jobLocation']['address']['addressLocality']);
        $this->assertSame('PR', $schema['jobLocation']['address']['addressRegion']);
        $this->assertSame('BRL', $schema['baseSalary']['currency']);
        $this->assertEquals(3000, $schema['baseSalary']['value']['minValue']);
        $this->assertSame('MONTH', $schema['baseSalary']['value']['unitText']);
        $this->assertSame($job->published_at->toIso8601String(), $schema['datePosted']);
        $this->assertSame($job->expires_at->toIso8601String(), $schema['validThrough']);
        $this->assertArrayNotHasKey('jobLocationType', $schema);
    }

    public function test_remote_job_uses_telecommute_and_omits_salary_when_not_disclosed(): void
    {
        $job = JobPosting::factory()->remote()->create();

        $schema = JobPostingSchema::build($job->load(['company', 'location']));

        $this->assertSame('TELECOMMUTE', $schema['jobLocationType']);
        $this->assertArrayNotHasKey('baseSalary', $schema);
        $this->assertArrayNotHasKey('jobLocation', $schema);
    }

    public function test_structured_data_is_not_generated_for_unavailable_jobs(): void
    {
        foreach (['draft', 'scheduled', 'expired', 'stale', 'archived'] as $state) {
            $job = JobPosting::factory()->{$state}()->create();
            $this->assertNull(JobPostingSchema::build($job->load(['company', 'location'])), "JSON-LD emitido para estado {$state}");
        }
    }

    public function test_structured_data_serialization_cannot_break_out_of_script_tag(): void
    {
        $json = JobPostingSchema::toJson(['title' => '</script><script>alert(1)</script>']);

        $this->assertStringNotContainsString('</script>', $json);
    }

    public function test_job_without_salary_exposes_no_salary(): void
    {
        $job = JobPosting::factory()->create();

        $this->get('/vagas/'.$job->slug)->assertInertia(fn (Assert $p) => $p->where('job.salary', null));
    }

    public function test_unknown_slug_returns_404(): void
    {
        $this->get('/vagas/nao-existe-abc123')->assertNotFound();
    }

    public function test_sitemap_lists_only_active_jobs(): void
    {
        $active = JobPosting::factory()->create();
        $expired = JobPosting::factory()->expired()->create();
        $draft = JobPosting::factory()->draft()->create();
        $archived = JobPosting::factory()->archived()->create();

        $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString(route('jobs.show', $active->slug), $xml);
        foreach ([$expired, $draft, $archived] as $job) {
            $this->assertStringNotContainsString($job->slug, $xml);
        }
    }

    public function test_robots_blocks_admin_and_points_to_sitemap(): void
    {
        $this->get('/robots.txt')->assertOk()
            ->assertSee('Disallow: /admin')
            ->assertSee(route('sitemap'));
    }

    public function test_filtered_listing_is_noindex_while_base_listing_is_indexable(): void
    {
        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p->where('seo.robots', 'index,follow'));
        $this->get('/vagas?q=abc')->assertInertia(fn (Assert $p) => $p
            ->where('seo.robots', 'noindex,follow')->where('seo.canonical', route('jobs.index')));
    }
}

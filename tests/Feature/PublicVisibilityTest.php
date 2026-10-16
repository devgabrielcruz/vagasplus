<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\JobPosting;
use App\Models\Platform;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_published_valid_jobs_appear_publicly(): void
    {
        $job = JobPosting::factory()->create(['title' => 'Analista de Suporte']);

        $this->get('/vagas')->assertOk()->assertInertia(fn (Assert $p) => $p
            ->component('Public/JobList')
            ->has('jobs.data', 1)
            ->where('jobs.data.0.title', 'Analista de Suporte'));

        $this->get('/vagas/'.$job->slug)->assertOk()->assertInertia(fn (Assert $p) => $p
            ->component('Public/JobShow')->where('closed', false));
    }

    public function test_drafts_do_not_appear_publicly(): void
    {
        $job = JobPosting::factory()->draft()->create();

        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 0));
        $this->get('/vagas/'.$job->slug)->assertNotFound();
    }

    public function test_scheduled_jobs_do_not_appear_before_publish_date(): void
    {
        $job = JobPosting::factory()->scheduled()->create();

        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 0));
        $this->get('/')->assertInertia(fn (Assert $p) => $p->has('recent', 0));
        $this->get('/vagas/'.$job->slug)->assertNotFound();
    }

    public function test_scheduled_job_becomes_visible_once_its_time_arrives_even_without_scheduler(): void
    {
        $job = JobPosting::factory()->scheduled()->create();

        $this->travel(3)->days();

        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1));
        $this->get('/vagas/'.$job->slug)->assertOk();
    }

    public function test_expired_jobs_are_hidden_from_listings_search_home_and_featured(): void
    {
        $expired = JobPosting::factory()->expired()->create(['title' => 'Vaga Antiga', 'is_featured' => true]);
        $stale = JobPosting::factory()->stale()->create(['title' => 'Vaga Vencida', 'is_featured' => true]);
        JobPosting::factory()->create(['title' => 'Vaga Aberta', 'is_featured' => true]);

        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1)->where('jobs.data.0.title', 'Vaga Aberta'));
        $this->get('/vagas?q=Vaga')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1));
        $this->get('/')->assertInertia(fn (Assert $p) => $p->has('featured', 1)->has('recent', 1));
        $this->get('/categorias/'.$expired->category->slug)->assertInertia(fn (Assert $p) => $p->has('jobs.data', 0));

        // O scheduler não precisa ter rodado: a consulta pública já filtra por prazo.
        $this->assertSame('published', $stale->fresh()->status->value);
    }

    public function test_archived_jobs_do_not_appear_publicly(): void
    {
        $job = JobPosting::factory()->archived()->create();

        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 0));
        $this->get('/vagas/'.$job->slug)->assertStatus(410);
    }

    public function test_empty_categories_are_not_listed_on_home(): void
    {
        $withJobs = Category::factory()->create();
        Category::factory()->create();
        JobPosting::factory()->create(['category_id' => $withJobs->id]);

        $this->get('/')->assertInertia(fn (Assert $p) => $p->has('categories', 1)->where('categories.0.slug', $withJobs->slug));
    }

    public function test_filters_and_pagination_work(): void
    {
        $cat = Category::factory()->create();
        JobPosting::factory()->count(14)->create(['category_id' => $cat->id]);
        JobPosting::factory()->remote()->create(['title' => 'Dev Remoto Laravel']);

        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p
            ->has('jobs.data', 12)->where('jobs.total', 15)->where('jobs.last_page', 2));
        $this->get('/vagas?page=2')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 3));
        $this->get('/vagas?modalidade=remote')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1));
        $this->get('/vagas?q=laravel')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1)->where('jobs.data.0.title', 'Dev Remoto Laravel'));
        $this->get('/vagas?categoria='.$cat->slug)->assertInertia(fn (Assert $p) => $p->where('jobs.total', 14));
        $this->get('/vagas?modalidade=remote&categoria='.$cat->slug)->assertInertia(fn (Assert $p) => $p->has('jobs.data', 0));
    }

    public function test_jobs_can_be_filtered_by_hiring_platform(): void
    {
        $gupy = Platform::factory()->create(['name' => 'Gupy', 'slug' => 'gupy']);
        $inhire = Platform::factory()->create(['name' => 'InHire', 'slug' => 'inhire']);
        Platform::factory()->create(['name' => 'Sem vagas', 'slug' => 'sem-vagas']);
        JobPosting::factory()->count(2)->create(['platform_id' => $gupy->id]);
        JobPosting::factory()->create(['platform_id' => $inhire->id]);
        JobPosting::factory()->expired()->create(['platform_id' => $inhire->id]);

        $this->get('/vagas?plataforma=gupy')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 2));
        $this->get('/vagas?plataforma=inhire')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1)->where('jobs.data.0.platform.label', 'InHire'));
        $this->get('/vagas?plataforma=invalida')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 0));
        // Somente plataformas com vagas abertas aparecem como opção, com contagem.
        $this->get('/vagas')->assertInertia(fn (Assert $p) => $p->has('options.platforms', 2)->where('options.platforms.0.count', 2));
    }

    public function test_categories_index_lists_only_categories_with_open_jobs(): void
    {
        $with = Category::factory()->create();
        Category::factory()->create();
        Category::factory()->create(['is_active' => false]);
        JobPosting::factory()->create(['category_id' => $with->id]);

        $this->get('/categorias')->assertOk()->assertInertia(fn (Assert $p) => $p
            ->component('Public/Categories')->has('categories', 1)->where('categories.0.slug', $with->slug));
        $this->get('/sitemap.xml')->assertSee(route('categories.index'), false);
    }

    public function test_search_treats_like_wildcards_literally(): void
    {
        JobPosting::factory()->create(['title' => 'Analista', 'description' => '<p>Texto comum</p>']);
        JobPosting::factory()->create(['title' => 'Bônus de 100% no primeiro ano', 'description' => '<p>Outro</p>']);
        JobPosting::factory()->create(['title' => 'Dev_Backend', 'description' => '<p>Outro</p>']);

        $this->get('/vagas?q=%25')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1)->where('jobs.data.0.title', 'Bônus de 100% no primeiro ano'));
        $this->get('/vagas?q=Dev_B')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 1));
        $this->get('/vagas?q=Dev-B')->assertInertia(fn (Assert $p) => $p->has('jobs.data', 0));
    }
}

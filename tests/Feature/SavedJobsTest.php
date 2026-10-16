<?php

namespace Tests\Feature;

use App\Models\JobPosting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SavedJobsTest extends TestCase
{
    use RefreshDatabase;

    public function test_saved_jobs_page_is_public_and_not_indexable(): void
    {
        $this->get('/minhas-vagas')->assertOk()->assertInertia(fn (Assert $p) => $p
            ->component('Public/SavedJobs')->where('seo.robots', 'noindex,follow'));
    }

    public function test_it_returns_open_jobs_in_the_requested_order_and_the_rest_as_closed(): void
    {
        $a = JobPosting::factory()->create(['title' => 'Vaga A']);
        $b = JobPosting::factory()->create(['title' => 'Vaga B']);
        $expired = JobPosting::factory()->expired()->create();
        $draft = JobPosting::factory()->draft()->create();
        $archived = JobPosting::factory()->archived()->create();
        $stale = JobPosting::factory()->stale()->create();

        $res = $this->getJson('/minhas-vagas/consultar?'.http_build_query(['slugs' => [
            $b->slug, $expired->slug, $a->slug, $draft->slug, $archived->slug, $stale->slug, 'nao-existe-abc123',
        ]]))->assertOk();

        $this->assertSame(['Vaga B', 'Vaga A'], collect($res->json('open'))->pluck('title')->all());
        // Nada que não seja público é revelado: todos entram como "encerrada".
        $this->assertEqualsCanonicalizing(
            [$expired->slug, $draft->slug, $archived->slug, $stale->slug, 'nao-existe-abc123'],
            $res->json('closed'),
        );
        $res->assertHeader('Cache-Control', 'no-store, private');
    }

    public function test_duplicate_slugs_are_collapsed(): void
    {
        $job = JobPosting::factory()->create();

        $res = $this->getJson('/minhas-vagas/consultar?'.http_build_query(['slugs' => [$job->slug, $job->slug]]))->assertOk();

        $this->assertCount(1, $res->json('open'));
    }

    public function test_input_is_validated_and_bounded(): void
    {
        $this->getJson('/minhas-vagas/consultar')->assertStatus(422);
        $this->getJson('/minhas-vagas/consultar?'.http_build_query(['slugs' => ['Slug Inválido!']]))->assertStatus(422);
        $this->getJson('/minhas-vagas/consultar?'.http_build_query(['slugs' => ['../../etc/passwd']]))->assertStatus(422);
        $this->getJson('/minhas-vagas/consultar?'.http_build_query(['slugs' => array_map(fn ($i) => "vaga-{$i}", range(1, 51))]))->assertStatus(422);
        $this->getJson('/minhas-vagas/consultar?'.http_build_query(['slugs' => array_map(fn ($i) => "vaga-{$i}", range(1, 50))]))->assertOk();
    }

    public function test_the_lookup_is_rate_limited(): void
    {
        foreach (range(1, 60) as $i) {
            $this->getJson('/minhas-vagas/consultar?slugs[]=vaga-'.$i)->assertOk();
        }

        $this->getJson('/minhas-vagas/consultar?slugs[]=vaga-x')->assertStatus(429);
    }
}

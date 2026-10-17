<?php

namespace Tests\Feature;

use App\Models\JobPosting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class VideoInterviewTest extends TestCase
{
    use RefreshDatabase;

    private function configure(): void
    {
        config(['services.tavus.key' => 'test-key', 'services.tavus.pal_id' => 'pal123', 'services.tavus.face_id' => '', 'services.tavus.max_call_seconds' => 300]);
    }

    public function test_creates_a_room_with_the_job_context_and_cost_limits(): void
    {
        $this->configure();
        Http::fake(['tavusapi.com/v2/conversations' => Http::response(['conversation_id' => 'c123abcd', 'conversation_url' => 'https://tavus.daily.co/c123abcd', 'status' => 'active'])]);
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/entrevista-video")
            ->assertOk()
            ->assertJson(['id' => 'c123abcd', 'url' => 'https://tavus.daily.co/c123abcd', 'seconds' => 300]);

        Http::assertSent(fn ($r) => $r->hasHeader('x-api-key', 'test-key')
            && $r['pal_id'] === 'pal123'
            && ! isset($r['face_id'])
            && str_contains($r['conversational_context'], $job->title)
            && $r['properties']['max_call_duration'] === 300
            && $r['properties']['participant_absent_timeout'] === 60);
    }

    public function test_is_unavailable_when_not_configured(): void
    {
        config(['services.tavus.key' => '', 'services.tavus.pal_id' => '']);
        Http::fake();
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/entrevista-video")->assertStatus(503);
        Http::assertNothingSent();

        $this->get("/vagas/{$job->slug}")->assertInertia(fn ($p) => $p->where('videoEnabled', false));
    }

    public function test_reports_the_feature_as_enabled_when_configured(): void
    {
        $this->configure();
        $job = JobPosting::factory()->create();

        $this->get("/vagas/{$job->slug}")->assertInertia(fn ($p) => $p->where('videoEnabled', true));
    }

    public function test_maps_provider_failures_to_safe_messages(): void
    {
        $this->configure();
        $job = JobPosting::factory()->create();

        Http::fake(['tavusapi.com/*' => Http::sequence()->push(['message' => 'segredo interno'], 500)->push([], 429)]);

        $this->postJson("/vagas/{$job->slug}/entrevista-video")->assertStatus(503)->assertJsonMissing(['message' => 'segredo interno']);
        $this->postJson("/vagas/{$job->slug}/entrevista-video")->assertStatus(429);
    }

    public function test_limits_rooms_per_ip_to_protect_the_bill(): void
    {
        $this->configure();
        config(['services.tavus.limit_hour' => 3, 'services.tavus.limit_day' => 6]);
        Http::fake(['tavusapi.com/*' => Http::response(['conversation_id' => 'c123abcd', 'conversation_url' => 'https://tavus.daily.co/c123abcd'])]);
        $job = JobPosting::factory()->create();

        for ($i = 0; $i < 3; $i++) {
            $this->postJson("/vagas/{$job->slug}/entrevista-video")->assertOk();
        }
        $this->postJson("/vagas/{$job->slug}/entrevista-video")->assertStatus(429);
    }

    public function test_ends_the_room(): void
    {
        $this->configure();
        Http::fake(['tavusapi.com/*' => Http::response([])]);

        $this->postJson('/entrevista-video/c123abcd/encerrar')->assertOk();
        Http::assertSent(fn ($r) => str_ends_with($r->url(), '/conversations/c123abcd/end'));

        $this->postJson('/entrevista-video/..%2Fx/encerrar')->assertNotFound();
    }
}

<?php

namespace Tests\Feature;

use App\Models\JobPosting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class InterviewSimulatorTest extends TestCase
{
    use RefreshDatabase;

    private function fakeGemini(string $text = 'Fale sobre sua experiência.', int $status = 200): void
    {
        config(['services.gemini.key' => 'test-key']);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => $text]]]]]], $status)]);
    }

    public function test_starts_the_interview_with_the_first_question(): void
    {
        $this->fakeGemini();
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/entrevista", ['messages' => []])
            ->assertOk()
            ->assertJson(['message' => 'Fale sobre sua experiência.', 'finished' => false, 'remaining' => 6]);

        Http::assertSent(fn ($r) => str_contains($r['systemInstruction']['parts'][0]['text'], $job->title) && $r['contents'][0]['role'] === 'user');
    }

    public function test_asks_for_final_feedback_after_the_last_answer(): void
    {
        $this->fakeGemini('Feedback final.');
        $job = JobPosting::factory()->create();
        $messages = [];
        for ($i = 0; $i < 6; $i++) {
            $messages[] = ['role' => 'model', 'text' => "Pergunta $i"];
            $messages[] = ['role' => 'user', 'text' => "Resposta $i"];
        }

        $this->postJson("/vagas/{$job->slug}/entrevista", ['messages' => $messages])
            ->assertOk()->assertJson(['finished' => true, 'remaining' => 0]);

        Http::assertSent(fn ($r) => str_contains($r['systemInstruction']['parts'][0]['text'], 'feedback final'));
    }

    public function test_rejects_a_malformed_conversation(): void
    {
        $this->fakeGemini();
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/entrevista", ['messages' => [['role' => 'user', 'text' => 'oi']]])->assertStatus(422);
        $this->postJson("/vagas/{$job->slug}/entrevista", ['messages' => [['role' => 'model', 'text' => 'Pergunta']]])->assertStatus(422);
        Http::assertNothingSent();
    }

    public function test_closed_jobs_have_no_simulator(): void
    {
        $this->fakeGemini();
        $job = JobPosting::factory()->expired()->create();

        $this->postJson("/vagas/{$job->slug}/entrevista", ['messages' => []])->assertNotFound();
        Http::assertNothingSent();
    }

    public function test_reports_when_the_free_quota_is_exhausted(): void
    {
        $this->fakeGemini(status: 429);
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/entrevista", ['messages' => []])->assertStatus(429)->assertJsonStructure(['message']);
    }

    public function test_unavailable_without_a_configured_key(): void
    {
        config(['services.gemini.key' => null]);
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/entrevista", ['messages' => []])->assertStatus(503);
        $this->get("/vagas/{$job->slug}")->assertInertia(fn ($p) => $p->where('assistantEnabled', false));
    }
}

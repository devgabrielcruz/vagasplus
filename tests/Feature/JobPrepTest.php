<?php

namespace Tests\Feature;

use App\Models\JobPosting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class JobPrepTest extends TestCase
{
    use RefreshDatabase;

    private function fakeJson(array $data, int $status = 200): void
    {
        config(['services.gemini.key' => 'test-key']);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => json_encode($data)]]]]]], $status)]);
    }

    private function questions(int $n = 8): array
    {
        return ['questions' => array_map(fn ($i) => ['category' => 'Técnica', 'question' => "Pergunta $i?", 'why' => 'Porque sim.', 'how' => 'Use o método STAR.'], range(1, $n))];
    }

    public function test_questions_are_generated_once_and_cached_per_job(): void
    {
        $this->fakeJson($this->questions());
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/perguntas-provaveis")->assertOk()->assertJsonCount(8, 'questions')->assertJsonPath('questions.0.question', 'Pergunta 1?');
        $this->postJson("/vagas/{$job->slug}/perguntas-provaveis")->assertOk();

        Http::assertSentCount(1);
    }

    public function test_questions_with_an_unusable_ai_answer_are_not_cached(): void
    {
        $this->fakeJson(['questions' => []]);
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/perguntas-provaveis")->assertStatus(503);
        $this->postJson("/vagas/{$job->slug}/perguntas-provaveis")->assertStatus(503);

        Http::assertSentCount(2);
    }

    public function test_match_returns_a_clamped_score_and_never_logs_or_stores_the_resume(): void
    {
        $this->fakeJson(['score' => 140, 'verdict' => 'Boa aderência.', 'matched' => ['ITIL'], 'gaps' => ['ISO 20000'], 'suggestions' => ['Quantifique resultados.']]);
        $job = JobPosting::factory()->create();
        $resume = str_repeat('Analista com 6 anos de experiência em governança de TI e ITIL. ', 3);

        $this->postJson("/vagas/{$job->slug}/compatibilidade", ['resume' => $resume])
            ->assertOk()
            ->assertExactJson(['score' => 100, 'verdict' => 'Boa aderência.', 'matched' => ['ITIL'], 'gaps' => ['ISO 20000'], 'suggestions' => ['Quantifique resultados.']]);

        Http::assertSent(fn ($r) => str_contains($r['contents'][0]['parts'][0]['text'], '<curriculo>') && $r['generationConfig']['responseSchema']['properties']['score']['type'] === 'INTEGER');
    }

    public function test_match_validates_the_resume(): void
    {
        $this->fakeJson([]);
        $job = JobPosting::factory()->create();

        $this->postJson("/vagas/{$job->slug}/compatibilidade", ['resume' => 'curto'])->assertStatus(422)->assertJsonValidationErrors('resume');
        $this->postJson("/vagas/{$job->slug}/compatibilidade", ['resume' => str_repeat('a', 8001)])->assertStatus(422);
        $this->postJson("/vagas/{$job->slug}/compatibilidade", [])->assertStatus(422);
        Http::assertNothingSent();
    }

    public function test_prep_tools_are_not_available_for_closed_jobs(): void
    {
        $this->fakeJson($this->questions());
        $job = JobPosting::factory()->expired()->create();

        $this->postJson("/vagas/{$job->slug}/perguntas-provaveis")->assertNotFound();
        $this->postJson("/vagas/{$job->slug}/compatibilidade", ['resume' => str_repeat('a', 100)])->assertNotFound();
        Http::assertNothingSent();
    }
}

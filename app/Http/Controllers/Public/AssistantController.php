<?php

namespace App\Http\Controllers\Public;

use App\Models\JobPosting;
use App\Services\AssistantUnavailableException;
use App\Services\InterviewSimulator;
use App\Services\JobPrep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Recursos de IA da página da vaga: simulador de entrevista, perguntas prováveis e compatibilidade com o currículo. */
class AssistantController extends PublicController
{
    public function interview(Request $request, JobPosting $job, InterviewSimulator $simulator): JsonResponse
    {
        abort_unless($job->isActive(), 404);

        $data = $request->validate([
            'messages' => ['present', 'array', 'max:'.(InterviewSimulator::MAX_ANSWERS * 2 + 2)],
            'messages.*.role' => ['required', 'in:user,model'],
            'messages.*.text' => ['required', 'string', 'max:1500'],
        ]);

        $history = array_values(array_map(fn ($m) => ['role' => $m['role'], 'text' => $m['text']], $data['messages']));

        // Conversa válida: começa pela IA, alterna e termina com o candidato (ou está vazia).
        foreach ($history as $i => $m) {
            if ($m['role'] !== ($i % 2 === 0 ? 'model' : 'user')) {
                return response()->json(['message' => 'Conversa inválida.'], 422);
            }
        }
        if ($history !== [] && end($history)['role'] !== 'user') {
            return response()->json(['message' => 'Conversa inválida.'], 422);
        }

        return $this->respond(fn () => $simulator->reply($job, $history));
    }

    public function questions(JobPosting $job, JobPrep $prep): JsonResponse
    {
        abort_unless($job->isActive(), 404);

        return $this->respond(fn () => ['questions' => $prep->questions($job)]);
    }

    public function match(Request $request, JobPosting $job, JobPrep $prep): JsonResponse
    {
        abort_unless($job->isActive(), 404);

        $data = $request->validate([
            'resume' => ['required', 'string', 'min:'.JobPrep::RESUME_MIN, 'max:'.JobPrep::RESUME_MAX],
        ], [
            'resume.required' => 'Cole o texto do seu currículo.',
            'resume.min' => 'O texto está curto demais. Cole o conteúdo completo do currículo.',
            'resume.max' => 'O texto é muito longo. Cole no máximo '.number_format(JobPrep::RESUME_MAX, 0, ',', '.').' caracteres.',
        ]);

        return $this->respond(fn () => $prep->match($job, trim($data['resume'])));
    }

    private function respond(callable $work): JsonResponse
    {
        try {
            return response()->json($work());
        } catch (AssistantUnavailableException $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() === 429 ? 429 : 503);
        }
    }
}

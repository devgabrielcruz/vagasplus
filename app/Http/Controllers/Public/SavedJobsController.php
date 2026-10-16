<?php

namespace App\Http\Controllers\Public;

use App\Models\JobPosting;
use App\Support\JobPresenter;
use App\Support\Seo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * "Minhas vagas": a lista fica no navegador do visitante (localStorage). O servidor não guarda nada:
 * só informa quais das vagas salvas continuam abertas, para a página não mostrar vaga encerrada como ativa.
 */
class SavedJobsController extends PublicController
{
    public const MAX = 50;

    public function index(): Response
    {
        return Inertia::render('Public/SavedJobs', [
            'seo' => Seo::make('Minhas vagas', 'Vagas que você salvou neste navegador para ver depois.', route('saved.index'), index: false),
        ]);
    }

    /** GET /minhas-vagas/consultar?slugs[]=... → { open: [cards...], closed: [slugs...] } */
    public function check(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slugs' => ['required', 'array', 'min:1', 'max:'.self::MAX],
            'slugs.*' => ['string', 'max:190', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
        ]);

        $slugs = array_values(array_unique($data['slugs']));

        $open = JobPosting::query()
            ->active()
            ->with(['company', 'location', 'category', 'platform'])
            ->whereIn('slug', $slugs)
            ->get()
            ->keyBy('slug');

        // Mantém a ordem pedida. Rascunho, expirada, arquivada ou inexistente são todas tratadas
        // como "encerrada": a resposta nunca revela se uma vaga não pública existe.
        $ordered = collect($slugs)->filter(fn ($s) => $open->has($s))->map(fn ($s) => JobPresenter::card($open[$s]))->values();

        return response()->json([
            'open' => $ordered,
            'closed' => collect($slugs)->reject(fn ($s) => $open->has($s))->values(),
        ])->header('Cache-Control', 'no-store');
    }
}

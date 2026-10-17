<?php

namespace App\Http\Controllers\Public;

use App\Enums\JobStatus;
use App\Models\JobPosting;
use App\Services\GeminiClient;
use App\Services\JobSearch;
use App\Services\TavusClient;
use App\Support\JobPostingSchema;
use App\Support\JobPresenter;
use App\Support\Seo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class JobController extends PublicController
{
    public function index(Request $request, JobSearch $search)
    {
        $filters = $this->searchFilters($request);
        $page = (int) $request->query('page', 1);

        $title = 'Vagas de emprego';
        if ($filters['q'] ?? null) {
            $title = "Vagas de {$filters['q']}";
        }

        return Inertia::render('Public/JobList', [
            'heading' => $title,
            'intro' => null,
            'jobs' => $this->paginated($search->paginate($filters)),
            'filters' => (object) $filters,
            'options' => $this->filterOptions(),
            'breadcrumbs' => [['label' => 'Início', 'url' => route('home')], ['label' => 'Vagas', 'url' => null]],
            // Buscas filtradas não são indexadas; a listagem base e suas páginas, sim.
            'seo' => Seo::make(
                $title.($page > 1 ? " - página {$page}" : ''),
                'Veja as vagas de emprego abertas e candidate-se direto no site da empresa. Filtre por cargo, cidade, modalidade e nível.',
                $filters === [] ? route('jobs.index', $page > 1 ? ['page' => $page] : []) : route('jobs.index'),
                index: $filters === [],
            ),
        ]);
    }

    public function show(JobPosting $job, JobSearch $search, GeminiClient $gemini, TavusClient $tavus)
    {
        $job->loadMissing(['company', 'location', 'category']);
        $status = $job->effectiveStatus();

        // Rascunhos e vagas agendadas que ainda não chegaram na data não existem publicamente.
        abort_if($job->status === JobStatus::Draft || ($job->status === JobStatus::Scheduled && $status === JobStatus::Scheduled), 404);

        $active = $job->isActive();

        $related = $search->query(['categoria' => $job->category->slug])
            ->whereKeyNot($job->id)
            ->limit($active ? 4 : 6)
            ->get()
            ->map(fn ($j) => JobPresenter::card($j))
            ->all();

        $response = Inertia::render('Public/JobShow', [
            'job' => JobPresenter::detail($job, $active),
            'closed' => ! $active,
            'preview' => false,
            'assistantEnabled' => $active && $gemini->configured(),
            'videoEnabled' => $active && $tavus->configured(),
            'related' => $related,
            'breadcrumbs' => array_values(array_filter([
                ['label' => 'Início', 'url' => route('home')],
                ['label' => 'Vagas', 'url' => route('jobs.index')],
                ['label' => $job->category->name, 'url' => route('categories.show', $job->category->slug)],
                ['label' => $job->title, 'url' => null],
            ])),
            'seo' => $active
                ? Seo::make(
                    "{$job->title} - {$job->company->name}",
                    strip_tags((string) $job->description),
                    route('jobs.show', $job->slug),
                    type: 'article',
                    image: $job->company->logo_url,
                    jsonLd: JobPostingSchema::build($job),
                )
                : Seo::make("Vaga encerrada: {$job->title}", 'Esta oportunidade foi encerrada. Veja vagas semelhantes ainda abertas.', route('jobs.show', $job->slug), index: false),
        ]);

        // Vagas arquivadas foram removidas em definitivo (410); expiradas mantêm a página útil de encerramento (200).
        if ($status === JobStatus::Archived) {
            return $this->withStatus($response, 410);
        }

        return $response;
    }

    private function withStatus($inertiaResponse, int $status): HttpResponse
    {
        return $inertiaResponse->toResponse(request())->setStatusCode($status);
    }
}

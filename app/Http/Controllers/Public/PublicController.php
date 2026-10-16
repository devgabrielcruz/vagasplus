<?php

namespace App\Http\Controllers\Public;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\WorkMode;
use App\Models\Platform;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\JobSearch;
use App\Support\JobPresenter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

abstract class PublicController extends Controller
{
    /** Categorias ativas que possuem ao menos uma vaga aberta. */
    protected function categoriesWithJobs(): Collection
    {
        return Category::query()
            ->active()
            ->withCount(['jobPostings as active_jobs_count' => fn ($q) => $q->active()])
            ->orderBy('position')
            ->orderBy('name')
            ->get()
            ->filter(fn (Category $c) => $c->active_jobs_count > 0)
            ->values()
            ->map(fn (Category $c) => [
                'name' => $c->name,
                'slug' => $c->slug,
                'icon' => $c->icon,
                'count' => $c->active_jobs_count,
                'url' => route('categories.show', $c->slug),
            ]);
    }

    /** Plataformas ativas que possuem ao menos uma vaga aberta, com contagem. */
    protected function platformsWithJobs(): array
    {
        return Platform::query()
            ->active()
            ->withCount(['jobPostings as active_jobs_count' => fn ($q) => $q->active()])
            ->orderBy('position')->orderBy('name')
            ->get()
            ->filter(fn (Platform $p) => $p->active_jobs_count > 0)
            ->map(fn (Platform $p) => [
                'value' => $p->slug, 'label' => $p->name, 'color' => $p->color, 'logo' => $p->logo_src, 'count' => $p->active_jobs_count,
            ])
            ->values()->all();
    }

    protected function filterOptions(): array
    {
        $options = fn (array $cases) => collect($cases)->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()])->all();

        return [
            'work_modes' => $options(WorkMode::cases()),
            'employment_types' => $options(EmploymentType::cases()),
            'experience_levels' => $options(ExperienceLevel::cases()),
            'platforms' => $this->platformsWithJobs(),
            'categories' => $this->categoriesWithJobs()->map(fn ($c) => ['value' => $c['slug'], 'label' => $c['name']])->all(),
        ];
    }

    protected function paginated(LengthAwarePaginator $paginator): array
    {
        return [
            'data' => $paginator->getCollection()->map(fn ($job) => JobPresenter::card($job))->all(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
            'prev_url' => $paginator->previousPageUrl(),
            'next_url' => $paginator->nextPageUrl(),
            'links' => collect(range(1, $paginator->lastPage()))
                ->filter(fn ($p) => $p === 1 || $p === $paginator->lastPage() || abs($p - $paginator->currentPage()) <= 2)
                ->map(fn ($p) => ['page' => $p, 'url' => $paginator->url($p), 'active' => $p === $paginator->currentPage()])
                ->values()
                ->all(),
        ];
    }

    protected function searchFilters(Request $request): array
    {
        return JobSearch::filtersFrom($request);
    }
}

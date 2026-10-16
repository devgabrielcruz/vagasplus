<?php

namespace App\Http\Controllers\Public;

use App\Models\JobPosting;
use App\Models\Location;
use App\Services\JobSearch;
use App\Support\Seo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends PublicController
{
    /** Páginas de localidade com menos vagas que isso não são indexadas (conteúdo fino). */
    public const MIN_JOBS_TO_INDEX = 3;

    public function show(Request $request, string $slug, JobSearch $search): Response
    {
        $location = Location::query()->where('slug', $slug)->firstOrFail();

        $filters = $this->searchFilters($request);
        $jobs = $search->query($filters)->where('location_id', $location->id)->paginate(12)->withQueryString();
        $activeTotal = JobPosting::query()->active()->where('location_id', $location->id)->count();

        return Inertia::render('Public/JobList', [
            'heading' => "Vagas em {$location->label}",
            'intro' => null,
            'jobs' => $this->paginated($jobs),
            'filters' => (object) $filters,
            'options' => $this->filterOptions(),
            'hideLocationFilter' => true,
            'breadcrumbs' => [
                ['label' => 'Início', 'url' => route('home')],
                ['label' => 'Vagas', 'url' => route('jobs.index')],
                ['label' => $location->label, 'url' => null],
            ],
            'seo' => Seo::make(
                "Vagas em {$location->label}",
                "Vagas de emprego abertas em {$location->label}. Candidate-se direto no site da empresa.",
                route('locations.show', $location->slug),
                index: $filters === [] && $activeTotal >= self::MIN_JOBS_TO_INDEX,
            ),
        ]);
    }
}

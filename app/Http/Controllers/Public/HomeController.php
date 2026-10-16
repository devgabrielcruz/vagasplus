<?php

namespace App\Http\Controllers\Public;

use App\Models\JobPosting;
use App\Services\JobSearch;
use App\Support\JobPresenter;
use App\Support\Seo;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends PublicController
{
    public function __invoke(JobSearch $search): Response
    {
        $featured = $search->query()->where('is_featured', true)->limit(6)->get();
        $recent = $search->query()->limit(9)->get();
        $platforms = $this->platformsWithJobs();

        return Inertia::render('Public/Home', [
            'featured' => $featured->map(fn ($j) => JobPresenter::card($j))->all(),
            'recent' => $recent->map(fn ($j) => JobPresenter::card($j))->all(),
            'categories' => $this->categoriesWithJobs()->all(),
            'options' => $this->filterOptions(),
            'platforms' => $platforms,
            // Números reais do banco (somente vagas ativas)
            'stats' => [
                'jobs' => JobPosting::query()->active()->count(),
                'companies' => JobPosting::query()->active()->distinct()->count('company_id'),
                'platforms' => count($platforms),
            ],
            'heroJobs' => ($featured->isNotEmpty() ? $featured : $recent)->take(3)->map(fn ($j) => JobPresenter::card($j))->values()->all(),
            'seo' => Seo::make(
                'Vagas de emprego em todo o Brasil',
                'Encontre vagas de emprego, descubra novas oportunidades e vá direto para a candidatura no site oficial da empresa.',
                route('home'),
            ),
        ]);
    }
}

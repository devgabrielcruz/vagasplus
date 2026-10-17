<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\JobPosting;
use App\Models\Location;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = [
            ['loc' => route('home'), 'lastmod' => null],
            ['loc' => route('jobs.index'), 'lastmod' => null],
            ['loc' => route('categories.index'), 'lastmod' => null],
            ['loc' => route('about'), 'lastmod' => null],
        ];

        if (config('features.job_submissions')) {
            $urls[] = ['loc' => route('submit.create'), 'lastmod' => null];
        }

        foreach (Category::active()->whereHas('jobPostings', fn ($q) => $q->active())->get() as $category) {
            $urls[] = ['loc' => route('categories.show', $category->slug), 'lastmod' => null];
        }

        $minJobs = LocationController::MIN_JOBS_TO_INDEX;
        $locations = Location::query()
            ->withCount(['jobPostings as active_jobs_count' => fn ($q) => $q->active()])
            ->get()
            ->filter(fn ($l) => $l->active_jobs_count >= $minJobs);
        foreach ($locations as $location) {
            $urls[] = ['loc' => route('locations.show', $location->slug), 'lastmod' => null];
        }

        // Somente vagas ativas: expiradas, rascunhos e arquivadas ficam de fora.
        JobPosting::query()->active()->select(['id', 'slug', 'updated_at'])->orderByDesc('published_at')->limit(45000)
            ->each(function ($job) use (&$urls) {
                $urls[] = ['loc' => route('jobs.show', $job->slug), 'lastmod' => $job->updated_at->toAtomString()];
            });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($urls as $url) {
            $xml .= '<url><loc>'.e($url['loc']).'</loc>'.($url['lastmod'] ? '<lastmod>'.$url['lastmod'].'</lastmod>' : '').'</url>';
        }
        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}

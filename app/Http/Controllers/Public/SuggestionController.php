<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Location;
use App\Support\Like;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Autocomplete dos campos de busca. Só sugere o que existe em vagas ABERTAS,
 * então nunca revela rascunhos, vagas expiradas ou empresas sem vagas ativas.
 */
class SuggestionController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $term = mb_substr(trim((string) $request->query('term', '')), 0, 60);
        $field = $request->query('field') === 'local' ? 'local' : 'q';

        if (mb_strlen($term) < 2) {
            return response()->json(['items' => []]);
        }

        $like = Like::contains($term);

        $items = $field === 'local' ? $this->locations($term, $like) : $this->terms($like);

        return response()->json(['items' => $items->values()])->header('Cache-Control', 'public, max-age=60');
    }

    private function terms(string $like)
    {
        $titles = JobPosting::query()->active()
            ->tap(fn ($q) => Like::where($q, 'job_postings.title', $like))
            ->select('title')->distinct()->orderBy('title')->limit(5)->pluck('title')
            ->map(fn ($t) => ['label' => $t, 'group' => 'Cargos', 'value' => $t, 'icon' => 'briefcase']);

        $companies = Company::query()
            ->whereHas('jobPostings', fn ($q) => $q->active())
            ->tap(fn ($q) => Like::where($q, 'companies.name', $like))
            ->orderBy('name')->limit(3)->get()
            ->map(fn (Company $c) => ['label' => $c->name, 'group' => 'Empresas', 'value' => $c->name, 'logo' => $c->logo_src, 'icon' => 'building']);

        $categories = Category::query()->active()
            ->whereHas('jobPostings', fn ($q) => $q->active())
            ->tap(fn ($q) => Like::where($q, 'categories.name', $like))
            ->orderBy('name')->limit(3)->get()
            ->map(fn (Category $c) => ['label' => $c->name, 'group' => 'Categorias', 'url' => route('categories.show', $c->slug), 'icon' => 'tag']);

        return $titles->concat($companies)->concat($categories)->take(10);
    }

    private function locations(string $term, string $like)
    {
        return Location::query()
            ->whereHas('jobPostings', fn ($q) => $q->active())
            ->where(function ($q) use ($term, $like) {
                Like::where($q, 'locations.city', $like);
                $q->orWhere('locations.state', strtoupper($term));
            })
            ->withCount(['jobPostings as active_jobs_count' => fn ($q) => $q->active()])
            ->orderByDesc('active_jobs_count')
            ->limit(8)->get()
            ->map(fn (Location $l) => [
                'label' => $l->label,
                'hint' => $l->active_jobs_count.' '.($l->active_jobs_count === 1 ? 'vaga' : 'vagas'),
                'value' => $l->city,
                'icon' => 'pin',
            ]);
    }
}

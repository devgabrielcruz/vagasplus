<?php

namespace App\Http\Controllers\Public;

use App\Models\Category;
use App\Services\JobSearch;
use App\Support\Seo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends PublicController
{
    public function index(): Response
    {
        return Inertia::render('Public/Categories', [
            'categories' => $this->categoriesWithJobs()->all(),
            'breadcrumbs' => [['label' => 'Início', 'url' => route('home')], ['label' => 'Categorias', 'url' => null]],
            'seo' => Seo::make(
                'Vagas por categoria',
                'Navegue pelas vagas de emprego por área de atuação: tecnologia, vendas, saúde, administrativo e muito mais.',
                route('categories.index'),
            ),
        ]);
    }

    public function show(Request $request, string $slug, JobSearch $search): Response
    {
        $category = Category::query()->active()->where('slug', $slug)->firstOrFail();

        $filters = $this->searchFilters($request);
        $filters['categoria'] = $category->slug;
        $jobs = $search->paginate($filters);
        $userFilters = array_diff_key($filters, ['categoria' => true]);

        return Inertia::render('Public/JobList', [
            'heading' => "Vagas de {$category->name}",
            'intro' => $category->description,
            'jobs' => $this->paginated($jobs),
            'filters' => (object) $userFilters,
            'options' => $this->filterOptions(),
            'lockedCategory' => $category->slug,
            'breadcrumbs' => [
                ['label' => 'Início', 'url' => route('home')],
                ['label' => 'Categorias', 'url' => route('categories.index')],
                ['label' => $category->name, 'url' => null],
            ],
            'seo' => Seo::make(
                "Vagas de {$category->name}",
                $category->description ?: "Vagas abertas na área de {$category->name}. Candidate-se direto no site da empresa.",
                route('categories.show', $category->slug),
                index: $userFilters === [] && $jobs->total() > 0,
            ),
        ]);
    }
}

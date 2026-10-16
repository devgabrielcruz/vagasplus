<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\SlugGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public const ICONS = ['briefcase', 'code', 'headset', 'megaphone', 'landmark', 'heart-pulse', 'graduation-cap', 'truck', 'shopping-cart', 'wrench', 'palette', 'scale', 'users', 'utensils', 'factory', 'building'];

    public function index(): Response
    {
        return Inertia::render('Admin/Categories', [
            'categories' => Category::query()
                ->withCount('jobPostings')
                ->orderBy('position')->orderBy('name')->get()
                ->map(fn (Category $c) => [
                    'id' => $c->id, 'name' => $c->name, 'slug' => $c->slug, 'icon' => $c->icon,
                    'description' => $c->description, 'is_active' => $c->is_active, 'position' => $c->position,
                    'jobs_count' => $c->job_postings_count,
                ]),
            'icons' => self::ICONS,
        ]);
    }

    public function store(Request $request, SlugGenerator $slugs): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = ($data['slug'] ?? null) ?: $slugs->category($data['name']);

        Category::create($data);

        return back()->with('success', 'Categoria criada.');
    }

    public function update(Request $request, Category $category, SlugGenerator $slugs): RedirectResponse
    {
        $data = $this->validated($request, $category);
        $data['slug'] = ($data['slug'] ?? null) ?: $category->slug;

        $category->update($data);

        return back()->with('success', 'Categoria atualizada.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->jobPostings()->exists()) {
            return back()->with('error', 'Esta categoria possui vagas. Desative-a em vez de excluir.');
        }

        $category->delete();

        return back()->with('success', 'Categoria excluída.');
    }

    private function validated(Request $request, ?Category $category = null): array
    {
        $request->merge(['slug' => $request->filled('slug') ? strtolower(trim($request->input('slug'))) : null]);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:140', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('categories', 'slug')->ignore($category?->id)],
            'icon' => ['nullable', Rule::in(self::ICONS)],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'position' => ['nullable', 'integer', 'min:0', 'max:65000'],
        ], [], ['name' => 'nome', 'slug' => 'slug', 'description' => 'descrição', 'position' => 'ordem']);
        $data['position'] = $data['position'] ?? 0;

        return $data;
    }
}

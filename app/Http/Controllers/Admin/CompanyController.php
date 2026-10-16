<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Rules\SafeUrl;
use App\Services\HtmlSanitizer;
use App\Services\LogoStorage;
use App\Services\SlugGenerator;
use App\Support\Like;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $companies = Company::query()
            ->withCount('jobPostings')
            ->when($q !== '', fn ($query) => Like::where($query, 'companies.name', Like::contains($q)))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Companies', [
            'filters' => ['q' => $q],
            'companies' => [
                'data' => $companies->getCollection()->map(fn (Company $c) => [
                    'id' => $c->id, 'name' => $c->name, 'slug' => $c->slug, 'website_url' => $c->website_url,
                    'logo_src' => $c->logo_src, 'logo_url' => $c->logo_url, 'has_upload' => (bool) $c->logo_path,
                    'about' => $c->about, 'jobs_count' => $c->job_postings_count,
                ])->all(),
                'current_page' => $companies->currentPage(),
                'last_page' => $companies->lastPage(),
                'total' => $companies->total(),
                'prev_url' => $companies->previousPageUrl(),
                'next_url' => $companies->nextPageUrl(),
                'links' => collect(range(1, $companies->lastPage()))
                    ->filter(fn ($p) => $p === 1 || $p === $companies->lastPage() || abs($p - $companies->currentPage()) <= 2)
                    ->map(fn ($p) => ['page' => $p, 'url' => $companies->url($p), 'active' => $p === $companies->currentPage()])
                    ->values()->all(),
            ],
        ]);
    }

    /** Sugestões para o campo "Empresa" do formulário de vaga. */
    public function suggest(Request $request): JsonResponse
    {
        $term = trim((string) $request->query('term', ''));

        if (mb_strlen($term) < 1) {
            return response()->json(['items' => []]);
        }

        $items = Company::query()
            ->tap(fn ($q) => Like::where($q, 'companies.name', Like::contains($term)))
            ->withCount('jobPostings')
            ->orderBy('name')
            ->limit(8)
            ->get()
            ->map(fn (Company $c) => [
                'label' => $c->name,
                'hint' => $c->job_postings_count.' '.($c->job_postings_count === 1 ? 'vaga' : 'vagas'),
                'logo' => $c->logo_src,
                'data' => ['website_url' => $c->website_url, 'about' => $c->about, 'logo_src' => $c->logo_src],
            ]);

        return response()->json(['items' => $items]);
    }

    public function store(Request $request, SlugGenerator $slugs, LogoStorage $logos, HtmlSanitizer $sanitizer): RedirectResponse
    {
        $data = $this->validated($request, null);

        $company = new Company([
            'name' => $data['name'],
            'slug' => $slugs->company($data['name']),
            'website_url' => $data['website_url'] ?? null,
            'logo_url' => $data['logo_url'] ?? null,
            'about' => $sanitizer->clean($data['about'] ?? null),
        ]);

        if ($request->hasFile('logo')) {
            $company->logo_path = $logos->store($request->file('logo'), 'companies');
        }

        $company->save();

        return back()->with('success', 'Empresa cadastrada.');
    }

    public function update(Request $request, Company $company, LogoStorage $logos, HtmlSanitizer $sanitizer): RedirectResponse
    {
        $data = $this->validated($request, $company);

        $company->fill([
            'name' => $data['name'],
            'website_url' => $data['website_url'] ?? null,
            'logo_url' => $data['logo_url'] ?? null,
            'about' => $sanitizer->clean($data['about'] ?? null),
        ]);

        if ($request->hasFile('logo')) {
            $company->logo_path = $logos->replace($company->logo_path, $request->file('logo'), 'companies');
        } elseif ($request->boolean('remove_logo')) {
            $logos->delete($company->logo_path);
            $company->logo_path = null;
            $company->logo_url = null;
        }

        $company->save();

        return back()->with('success', 'Empresa atualizada.');
    }

    public function destroy(Company $company, LogoStorage $logos): RedirectResponse
    {
        if ($company->jobPostings()->exists()) {
            return back()->with('error', 'Esta empresa possui vagas e não pode ser excluída.');
        }

        $logos->delete($company->logo_path);
        $company->delete();

        return back()->with('success', 'Empresa excluída.');
    }

    private function validated(Request $request, ?Company $company): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:160', function ($attr, $value, $fail) use ($company) {
                $exists = Company::query()->whereRaw('lower(name) = ?', [mb_strtolower(trim($value))])
                    ->when($company, fn ($q) => $q->whereKeyNot($company->id))->exists();
                if ($exists) {
                    $fail('Já existe uma empresa com este nome.');
                }
            }],
            'website_url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'logo_url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:1024'],
            'about' => ['nullable', 'string', 'max:5000'],
            'remove_logo' => ['boolean'],
        ], [], ['name' => 'nome', 'website_url' => 'site', 'logo_url' => 'URL do logotipo', 'logo' => 'logotipo', 'about' => 'sobre']);
    }
}

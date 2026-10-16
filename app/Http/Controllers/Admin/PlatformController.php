<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Platform;
use App\Rules\SafeUrl;
use App\Services\LogoStorage;
use App\Services\SlugGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlatformController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Platforms', [
            'platforms' => Platform::query()->withCount('jobPostings')->orderBy('position')->orderBy('name')->get()
                ->map(fn (Platform $p) => [
                    'id' => $p->id, 'name' => $p->name, 'slug' => $p->slug, 'color' => $p->color,
                    'logo_src' => $p->logo_src, 'logo_url' => str_starts_with((string) $p->logo_url, '/') ? null : $p->logo_url,
                    'has_upload' => (bool) $p->logo_path, 'uses_email' => $p->uses_email, 'is_active' => $p->is_active,
                    'position' => $p->position, 'jobs_count' => $p->job_postings_count,
                ]),
        ]);
    }

    public function store(Request $request, SlugGenerator $slugs, LogoStorage $logos): RedirectResponse
    {
        $data = $this->validated($request, null);

        $platform = new Platform($data);
        $platform->slug = $slugs->unique(Platform::class, $data['name']);

        if ($request->hasFile('logo')) {
            $platform->logo_path = $logos->store($request->file('logo'), 'platforms');
        }

        $platform->save();

        return back()->with('success', 'Plataforma cadastrada.');
    }

    public function update(Request $request, Platform $platform, LogoStorage $logos): RedirectResponse
    {
        $data = $this->validated($request, $platform);

        // Enviar uma URL nova substitui o logo local de demonstração; sem URL, mantém o atual.
        if (empty($data['logo_url'])) {
            unset($data['logo_url']);
        }

        $platform->fill($data);

        if ($request->hasFile('logo')) {
            $platform->logo_path = $logos->replace($platform->logo_path, $request->file('logo'), 'platforms');
        } elseif ($request->boolean('remove_logo')) {
            $logos->delete($platform->logo_path);
            $platform->logo_path = null;
            $platform->logo_url = null;
        }

        $platform->save();

        return back()->with('success', 'Plataforma atualizada.');
    }

    public function destroy(Platform $platform, LogoStorage $logos): RedirectResponse
    {
        if ($platform->jobPostings()->exists()) {
            return back()->with('error', 'Esta plataforma possui vagas. Desative-a em vez de excluir.');
        }

        $logos->delete($platform->logo_path);
        $platform->delete();

        return back()->with('success', 'Plataforma excluída.');
    }

    private function validated(Request $request, ?Platform $platform): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'logo_url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:1024'],
            'uses_email' => ['boolean'],
            'is_active' => ['boolean'],
            'position' => ['nullable', 'integer', 'min:0', 'max:65000'],
            'remove_logo' => ['boolean'],
        ], ['color.regex' => 'Informe uma cor no formato #RRGGBB.'], ['name' => 'nome', 'color' => 'cor', 'logo_url' => 'URL do logotipo', 'logo' => 'logotipo', 'position' => 'ordem']);

        $data['position'] = $data['position'] ?? 0;
        $data['uses_email'] = (bool) ($data['uses_email'] ?? false);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);
        unset($data['logo'], $data['remove_logo']);

        return $data;
    }
}

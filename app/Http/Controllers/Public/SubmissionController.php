<?php

namespace App\Http\Controllers\Public;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\SalaryPeriod;
use App\Enums\WorkMode;
use App\Http\Requests\SubmitJobRequest;
use App\Models\Category;
use App\Models\JobSubmission;
use App\Models\Platform;
use App\Services\HtmlSanitizer;
use App\Services\LogoStorage;
use App\Support\Seo;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Fluxo público "Publicar uma vaga": o envio vira uma solicitação pendente de análise no painel.
 * Nada é publicado sem aprovação de um administrador.
 */
class SubmissionController extends PublicController
{
    public function create(): Response
    {
        $enum = fn (array $cases) => collect($cases)->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()])->all();

        return Inertia::render('Public/SubmitJob', [
            'categories' => Category::query()->active()->orderBy('position')->orderBy('name')->get(['id', 'name']),
            'platforms' => Platform::query()->active()->orderBy('position')->orderBy('name')->get()
                ->map(fn ($p) => ['value' => $p->id, 'label' => $p->name, 'logo' => $p->logo_src, 'uses_email' => $p->uses_email]),
            'options' => [
                'work_modes' => $enum(WorkMode::cases()),
                'employment_types' => $enum(EmploymentType::cases()),
                'experience_levels' => $enum(ExperienceLevel::cases()),
                'salary_periods' => $enum(SalaryPeriod::cases()),
            ],
            'seo' => Seo::make(
                'Publicar uma vaga',
                'Divulgue sua vaga no VagasPlus. Envie os dados e nossa equipe analisa antes de publicar.',
                route('submit.create'),
            ),
        ]);
    }

    public function store(SubmitJobRequest $request, HtmlSanitizer $sanitizer, LogoStorage $logos): RedirectResponse
    {
        // Robôs preenchem o campo escondido: respondemos "sucesso" sem salvar nada.
        if ($request->filled('website_confirm')) {
            return redirect()->route('submit.create')->with('submitted', true);
        }

        $data = $request->safe()->except(['company_logo', 'authorized', 'website_confirm']);

        foreach (['description', 'requirements', 'benefits'] as $field) {
            $data[$field] = $sanitizer->clean($data[$field] ?? null);
        }

        $submission = new JobSubmission($data);
        $submission->submitter_ip = $request->ip();

        if ($request->hasFile('company_logo')) {
            $submission->company_logo_path = $logos->store($request->file('company_logo'), 'submissions');
        }

        $submission->save();

        return redirect()->route('submit.done')->with('submitted', true);
    }

    public function done(): Response|RedirectResponse
    {
        // A página de agradecimento só existe logo após um envio.
        if (! session()->has('submitted')) {
            return redirect()->route('submit.create');
        }

        return Inertia::render('Public/SubmitJobDone', [
            'seo' => [...Seo::make('Vaga enviada', 'Recebemos sua vaga e vamos analisá-la.', route('submit.done'), index: false)],
        ]);
    }
}
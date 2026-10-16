<?php

namespace App\Http\Requests\Admin;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\JobStatus;
use App\Models\Platform;
use App\Enums\SalaryPeriod;
use App\Enums\WorkMode;
use App\Models\JobPosting;
use App\Rules\SafeUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class JobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    /** Vaga sendo editada (null na criação). */
    private function job(): ?JobPosting
    {
        $job = $this->route('job');

        return $job instanceof JobPosting ? $job : null;
    }

    public function rules(): array
    {
        $job = $this->job();
        $lifecycleEditable = $job === null || in_array($job->status, [JobStatus::Draft, JobStatus::Scheduled], true);

        $actions = $lifecycleEditable ? ['save', 'publish', 'schedule'] : ['save'];

        return [
            'action' => ['required', Rule::in($actions)],

            'title' => ['required', 'string', 'min:3', 'max:180'],
            'slug' => ['nullable', 'string', 'max:190', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('job_postings', 'slug')->ignore($job?->id)],
            'company_name' => ['required', 'string', 'max:160'],
            'company_website_url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'company_logo_url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'company_logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:1024'],
            'remove_company_logo' => ['boolean'],
            'company_about' => ['nullable', 'string', 'max:5000'],

            'description' => ['required', 'string', 'max:30000'],
            'responsibilities' => ['nullable', 'string', 'max:30000'],
            'requirements' => ['nullable', 'string', 'max:30000'],
            'nice_to_have' => ['nullable', 'string', 'max:30000'],
            'benefits' => ['nullable', 'string', 'max:30000'],
            'additional_info' => ['nullable', 'string', 'max:30000'],

            'category_id' => ['required', Rule::exists('categories', 'id')],
            'city' => ['nullable', 'string', 'max:120', 'required_with:state', 'required_unless:work_mode,remote'],
            'state' => ['nullable', 'string', 'size:2', 'required_with:city', 'required_unless:work_mode,remote'],
            'work_mode' => ['required', Rule::enum(WorkMode::class)],
            'employment_type' => ['required', Rule::enum(EmploymentType::class)],
            'experience_level' => ['nullable', Rule::enum(ExperienceLevel::class)],

            'salary_min' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'salary_max' => ['nullable', 'numeric', 'min:0', 'max:99999999', 'gte:salary_min'],
            'salary_currency' => ['nullable', 'string', 'size:3'],
            'salary_period' => ['nullable', Rule::enum(SalaryPeriod::class), 'required_with:salary_min,salary_max'],

            'source_name' => ['nullable', 'string', 'max:120'],
            'source_url' => ['nullable', 'string', 'max:1000', new SafeUrl(false)],
            'platform_id' => ['required', Rule::exists('platforms', 'id')],
            'apply_url' => [Rule::requiredIf(fn () => ! $this->usesEmail()), 'nullable', 'string', 'max:1000', new SafeUrl(false)],
            'apply_email' => [Rule::requiredIf(fn () => $this->usesEmail()), 'nullable', 'email:rfc', 'max:190'],
            'source_published_at' => ['nullable', 'date', 'before_or_equal:now'],
            'is_featured' => ['boolean'],

            // Ciclo de vida (somente rascunho/agendada/criação)
            'publish_at' => ['nullable', 'date', Rule::requiredIf(fn () => $this->input('action') === 'schedule')],
            'validity_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'expires_at' => ['nullable', 'date'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'título', 'slug' => 'slug', 'company_name' => 'empresa',
            'company_website_url' => 'site da empresa', 'company_logo_url' => 'logotipo',
            'description' => 'descrição', 'category_id' => 'categoria', 'city' => 'cidade', 'state' => 'estado',
            'work_mode' => 'modalidade', 'employment_type' => 'tipo de contratação', 'experience_level' => 'nível de experiência',
            'salary_min' => 'salário mínimo', 'salary_max' => 'salário máximo', 'salary_period' => 'periodicidade',
            'source_url' => 'URL original', 'apply_url' => 'URL de candidatura', 'apply_email' => 'e-mail de candidatura', 'platform_id' => 'plataforma', 'company_logo' => 'logotipo da empresa', 'source_published_at' => 'data original de publicação',
            'publish_at' => 'data de publicação', 'expires_at' => 'data de expiração', 'validity_days' => 'validade',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured' => $this->boolean('is_featured'),
            'state' => $this->filled('state') ? strtoupper((string) $this->input('state')) : null,
            // Candidatura por e-mail não tem link; links não têm e-mail.
            'apply_url' => $this->usesEmail() ? null : $this->input('apply_url'),
            'apply_email' => $this->usesEmail() ? $this->input('apply_email') : null,
            'slug' => $this->filled('slug') ? strtolower(trim((string) $this->input('slug'))) : null,
        ]);
    }

    /** A plataforma escolhida recebe candidaturas por e-mail (sem link)? */
    private function usesEmail(): bool
    {
        return (bool) Platform::query()->whereKey($this->input('platform_id'))->value('uses_email');
    }

    /** Data de publicação solicitada (null = agora). */
    public function publishAt(): ?Carbon
    {
        return $this->filled('publish_at') ? Carbon::parse($this->input('publish_at')) : null;
    }

    /** Expiração solicitada: por data personalizada ou por prazo predefinido. */
    public function expiresAt(): ?Carbon
    {
        if ($this->filled('expires_at')) {
            return Carbon::parse($this->input('expires_at'));
        }

        if ($this->filled('validity_days')) {
            return ($this->publishAt() ?? now())->copy()->addDays((int) $this->input('validity_days'));
        }

        return null;
    }
}

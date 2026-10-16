<?php

namespace App\Http\Requests;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\SalaryPeriod;
use App\Enums\WorkMode;
use App\Models\Platform;
use App\Rules\SafeUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Envio público de vaga para análise (sem login). */
class SubmitJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'submitter_name' => ['required', 'string', 'min:2', 'max:120'],
            'submitter_email' => ['required', 'email:rfc', 'max:190'],
            'submitter_phone' => ['nullable', 'string', 'max:30', 'regex:/^[0-9 ()+\-.]{8,30}$/'],

            'company_name' => ['required', 'string', 'min:2', 'max:160'],
            'company_website_url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'company_logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:1024'],

            'title' => ['required', 'string', 'min:3', 'max:180'],
            'category_id' => ['required', Rule::exists('categories', 'id')->where('is_active', true)],
            'work_mode' => ['required', Rule::enum(WorkMode::class)],
            'employment_type' => ['required', Rule::enum(EmploymentType::class)],
            'experience_level' => ['nullable', Rule::enum(ExperienceLevel::class)],
            'city' => ['nullable', 'string', 'max:120', 'required_with:state', 'required_unless:work_mode,remote'],
            'state' => ['nullable', 'string', 'size:2', 'required_with:city', 'required_unless:work_mode,remote'],
            'description' => ['required', 'string', 'min:30', 'max:20000'],
            'requirements' => ['nullable', 'string', 'max:20000'],
            'benefits' => ['nullable', 'string', 'max:20000'],
            'salary_min' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'salary_max' => ['nullable', 'numeric', 'min:0', 'max:99999999', 'gte:salary_min'],
            'salary_period' => ['nullable', Rule::enum(SalaryPeriod::class), 'required_with:salary_min,salary_max'],

            'platform_id' => ['required', Rule::exists('platforms', 'id')->where('is_active', true)],
            'apply_url' => [Rule::requiredIf(fn () => ! $this->usesEmail()), 'nullable', 'string', 'max:1000', new SafeUrl(false)],
            'apply_email' => [Rule::requiredIf(fn () => $this->usesEmail()), 'nullable', 'email:rfc', 'max:190'],

            'authorized' => ['accepted'],
            // Armadilha para robôs (website_confirm): tratada no controller, sem revelar o bloqueio.
            'website_confirm' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'submitter_name' => 'nome', 'submitter_email' => 'e-mail', 'submitter_phone' => 'telefone',
            'company_name' => 'empresa', 'company_website_url' => 'site da empresa', 'company_logo' => 'logotipo',
            'title' => 'título da vaga', 'category_id' => 'categoria', 'work_mode' => 'modalidade',
            'employment_type' => 'tipo de contratação', 'experience_level' => 'nível', 'city' => 'cidade', 'state' => 'estado',
            'description' => 'descrição', 'salary_min' => 'salário mínimo', 'salary_max' => 'salário máximo',
            'salary_period' => 'periodicidade', 'platform_id' => 'plataforma', 'apply_url' => 'link de candidatura',
            'apply_email' => 'e-mail de candidatura',
        ];
    }

    public function messages(): array
    {
        return [
            'authorized.accepted' => 'Confirme que você tem autorização para divulgar esta vaga.',
            'description.min' => 'Descreva a vaga com pelo menos 30 caracteres.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'state' => $this->filled('state') ? strtoupper((string) $this->input('state')) : null,
            'apply_url' => $this->usesEmail() ? null : $this->input('apply_url'),
            'apply_email' => $this->usesEmail() ? $this->input('apply_email') : null,
        ]);
    }

    private function usesEmail(): bool
    {
        return (bool) Platform::query()->whereKey($this->input('platform_id'))->value('uses_email');
    }
}

<?php

namespace App\Services;

use App\Enums\JobEvent;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Location;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Grava o conteúdo de uma vaga (campos editoriais). Status e datas de ciclo de vida
 * são tratados exclusivamente por JobLifecycle.
 */
class JobPostingWriter
{
    private const RICH_FIELDS = ['description', 'responsibilities', 'requirements', 'nice_to_have', 'benefits', 'additional_info'];

    public function __construct(
        private readonly HtmlSanitizer $sanitizer,
        private readonly SlugGenerator $slugs,
        private readonly JobLifecycle $lifecycle,
        private readonly LogoStorage $logos,
    ) {}

    public function create(array $data, User $by): JobPosting
    {
        return DB::transaction(function () use ($data, $by) {
            $attributes = $this->attributes($data);
            $attributes['slug'] = ! empty($data['slug'])
                ? $data['slug']
                : $this->slugs->forJob($data['title'], $data['company_name']);

            $job = new JobPosting($attributes);
            $job->forceFill(['status' => 'draft', 'created_by' => $by->id, 'updated_by' => $by->id])->save();

            $this->lifecycle->log($job, JobEvent::Created, null, $by);

            return $job;
        });
    }

    public function update(JobPosting $job, array $data, User $by): JobPosting
    {
        return DB::transaction(function () use ($job, $data, $by) {
            $attributes = $this->attributes($data);

            // O slug é estável: só muda se o administrador alterar o campo explicitamente.
            if (! empty($data['slug'])) {
                $attributes['slug'] = $data['slug'];
            }

            $job->fill($attributes);
            $job->updated_by = $by->id;
            $changed = array_keys($job->getDirty());
            $job->save();

            if ($changed !== []) {
                $this->lifecycle->log($job, JobEvent::Updated, $job->status, $by, ['fields' => array_values(array_diff($changed, ['updated_by']))]);
            }

            return $job;
        });
    }

    private function attributes(array $data): array
    {
        $attributes = collect($data)->only([
            'title', 'category_id', 'work_mode', 'employment_type', 'experience_level',
            'salary_min', 'salary_max', 'salary_currency', 'salary_period',
            'source_name', 'source_url', 'apply_url', 'apply_email', 'platform_id', 'is_featured', 'source_published_at',
        ])->all();

        foreach (self::RICH_FIELDS as $field) {
            $attributes[$field] = $this->sanitizer->clean($data[$field] ?? null);
        }

        $attributes['company_id'] = $this->company($data)->id;
        $attributes['location_id'] = $this->location($data)?->id;
        $attributes['salary_currency'] = $attributes['salary_currency'] ?? 'BRL';

        if (($attributes['salary_min'] ?? null) === null && ($attributes['salary_max'] ?? null) === null) {
            $attributes['salary_period'] = null;
        }

        return $attributes;
    }

    private function company(array $data): Company
    {
        $name = trim($data['company_name']);

        $company = Company::query()->whereRaw('lower(name) = ?', [mb_strtolower($name)])->first()
            ?? Company::create(['name' => $name, 'slug' => $this->slugs->company($name)]);

        $updates = array_filter([
            'website_url' => $data['company_website_url'] ?? null,
            'logo_url' => $data['company_logo_url'] ?? null,
            'about' => $this->sanitizer->clean($data['company_about'] ?? null),
        ]);

        if (! empty($data['remove_company_logo']) && empty($data['company_logo'])) {
            $this->logos->delete($company->logo_path);
            $updates['logo_path'] = null;
            $updates['logo_url'] = null;
        }

        // Empresa nova (ou existente sem logo) pode receber o logo enviado junto com a vaga.
        if (! empty($data['company_logo'])) {
            $updates['logo_path'] = $this->logos->replace($company->logo_path, $data['company_logo'], 'companies');
        }

        if ($updates !== []) {
            $company->update($updates);
        }

        return $company;
    }

    private function location(array $data): ?Location
    {
        $city = trim((string) ($data['city'] ?? ''));
        $state = strtoupper(trim((string) ($data['state'] ?? '')));

        if ($city === '' || $state === '') {
            return null;
        }

        return Location::query()->whereRaw('lower(city) = ?', [mb_strtolower($city)])->where('state', $state)->first()
            ?? Location::create(['city' => $city, 'state' => $state, 'slug' => $this->slugs->location($city, $state)]);
    }
}

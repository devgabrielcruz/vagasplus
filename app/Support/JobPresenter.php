<?php

namespace App\Support;

use App\Models\JobPosting;
use Illuminate\Support\Carbon;

/**
 * Converte vagas em arrays prontos para as páginas Inertia.
 */
class JobPresenter
{
    public static function card(JobPosting $job): array
    {
        return [
            'id' => $job->id,
            'slug' => $job->slug,
            'url' => route('jobs.show', $job->slug),
            'title' => $job->title,
            'company' => ['name' => $job->company->name, 'logo_url' => $job->company->logo_src],
            'location' => $job->location?->label,
            'work_mode' => ['value' => $job->work_mode->value, 'label' => $job->work_mode->label()],
            'employment_type' => $job->employment_type->label(),
            'experience_level' => $job->experience_level?->label(),
            'salary' => self::salary($job),
            'platform' => self::platform($job->platform),
            'category' => $job->category ? ['name' => $job->category->name, 'slug' => $job->category->slug] : null,
            'published_at' => $job->published_at?->toIso8601String(),
            'published_label' => self::relativeDate($job->published_at),
            'is_new' => $job->published_at !== null && $job->published_at->gt(now()->subDays(3)),
            'is_featured' => $job->is_featured,
        ];
    }

    public static function detail(JobPosting $job, bool $acceptingApplications): array
    {
        return self::card($job) + [
            'status' => $job->effectiveStatus()->value,
            'sections' => [
                'description' => $job->description,
                'responsibilities' => $job->responsibilities,
                'requirements' => $job->requirements,
                'nice_to_have' => $job->nice_to_have,
                'benefits' => $job->benefits,
                'additional_info' => $job->additional_info,
            ],
            // A URL de candidatura só é exposta quando a vaga está efetivamente aberta.
            'apply_url' => $acceptingApplications ? $job->apply_url : null,
            'apply_email' => $acceptingApplications ? $job->apply_email : null,
            'apply_host' => $acceptingApplications && $job->apply_url ? parse_url($job->apply_url, PHP_URL_HOST) : null,
            'source_name' => $job->source_name,
            'expires_at' => $job->expires_at?->toIso8601String(),
            'expires_label' => $job->expires_at?->locale('pt_BR')->isoFormat('D [de] MMMM [de] YYYY'),
            'published_date_label' => $job->published_at?->locale('pt_BR')->isoFormat('D [de] MMMM [de] YYYY'),
            'company_about' => $job->company->about,
            'company_website' => $job->company->website_url,
        ];
    }

    public static function platform(\App\Models\Platform $p): array
    {
        return ['value' => $p->slug, 'label' => $p->name, 'color' => $p->color, 'logo' => $p->logo_src, 'uses_email' => $p->uses_email];
    }

    public static function salary(JobPosting $job): ?string
    {
        if (! $job->hasSalary()) {
            return null;
        }

        $symbol = $job->salary_currency === 'BRL' ? 'R$' : $job->salary_currency;
        $fmt = fn ($v) => $symbol.' '.number_format((float) $v, (float) $v == floor((float) $v) ? 0 : 2, ',', '.');

        $min = $job->salary_min;
        $max = $job->salary_max;

        $range = match (true) {
            $min !== null && $max !== null && (float) $min !== (float) $max => $fmt($min).' – '.$fmt($max),
            $min !== null && $max !== null => $fmt($min),
            $min !== null => 'A partir de '.$fmt($min),
            default => 'Até '.$fmt($max),
        };

        return trim($range.' '.($job->salary_period?->label() ?? ''));
    }

    public static function relativeDate(?Carbon $date): ?string
    {
        if ($date === null) {
            return null;
        }

        $days = (int) $date->copy()->startOfDay()->diffInDays(now()->startOfDay(), true);

        return match (true) {
            $days === 0 => 'Publicada hoje',
            $days === 1 => 'Publicada ontem',
            $days < 30 => "Publicada há {$days} dias",
            default => 'Publicada em '.$date->locale('pt_BR')->isoFormat('D [de] MMM [de] YYYY'),
        };
    }
}

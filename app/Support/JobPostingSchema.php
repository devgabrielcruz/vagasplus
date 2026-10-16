<?php

namespace App\Support;

use App\Enums\WorkMode;
use App\Models\JobPosting;

/**
 * Dados estruturados schema.org/JobPosting. Só são gerados para vagas ativas e
 * refletem exatamente os dados visíveis na página.
 */
class JobPostingSchema
{
    public static function build(JobPosting $job): ?array
    {
        if (! $job->isActive()) {
            return null;
        }

        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'JobPosting',
            'title' => $job->title,
            'description' => self::description($job),
            'datePosted' => $job->published_at->toIso8601String(),
            'validThrough' => $job->expires_at->toIso8601String(),
            'employmentType' => $job->employment_type->schemaOrg(),
            'url' => route('jobs.show', $job->slug),
            'identifier' => ['@type' => 'PropertyValue', 'name' => config('app.name'), 'value' => (string) $job->id],
            'hiringOrganization' => array_filter([
                '@type' => 'Organization',
                'name' => $job->company->name,
                'sameAs' => $job->company->website_url,
                'logo' => $job->company->logo_absolute_url,
            ]),
        ];

        if ($job->work_mode === WorkMode::Remote) {
            $schema['jobLocationType'] = 'TELECOMMUTE';
            $schema['applicantLocationRequirements'] = ['@type' => 'Country', 'name' => 'BR'];
        }

        if ($job->location) {
            $schema['jobLocation'] = [
                '@type' => 'Place',
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressLocality' => $job->location->city,
                    'addressRegion' => $job->location->state,
                    'addressCountry' => 'BR',
                ],
            ];
        }

        if ($job->hasSalary() && $job->salary_period) {
            $schema['baseSalary'] = [
                '@type' => 'MonetaryAmount',
                'currency' => $job->salary_currency,
                'value' => array_filter([
                    '@type' => 'QuantitativeValue',
                    'minValue' => $job->salary_min !== null ? (float) $job->salary_min : null,
                    'maxValue' => $job->salary_max !== null ? (float) $job->salary_max : null,
                    'unitText' => $job->salary_period->schemaOrg(),
                ], fn ($v) => $v !== null),
            ];
        }

        return $schema;
    }

    /** Mesmo conteúdo exibido na página, na ordem das seções. */
    private static function description(JobPosting $job): string
    {
        $titles = [
            'description' => null,
            'responsibilities' => 'Responsabilidades',
            'requirements' => 'Requisitos',
            'nice_to_have' => 'Diferenciais',
            'benefits' => 'Benefícios',
            'additional_info' => 'Informações adicionais',
        ];

        $html = '';
        foreach ($titles as $field => $title) {
            if ($job->{$field}) {
                $html .= ($title ? '<h3>'.e($title).'</h3>' : '').$job->{$field};
            }
        }

        return $html;
    }

    /** Serialização segura para uso dentro de <script type="application/ld+json">. */
    public static function toJson(array $schema): string
    {
        return json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_THROW_ON_ERROR);
    }
}

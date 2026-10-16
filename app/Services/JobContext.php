<?php

namespace App\Services;

use App\Models\JobPosting;

/** Texto da vaga para ser enviado à IA como DADO (entre <vaga> e </vaga>). */
class JobContext
{
    private const LIMIT = 6000;

    public static function text(JobPosting $job): string
    {
        $job->loadMissing(['company', 'category']);

        $sections = collect(['Sobre a vaga' => $job->description, 'Responsabilidades' => $job->responsibilities, 'Requisitos' => $job->requirements, 'Diferenciais' => $job->nice_to_have])
            ->map(fn ($html, $title) => $html ? $title.":\n".trim(preg_replace('/\s+/u', ' ', strip_tags(str_replace(['</li>', '</p>'], "\n", (string) $html)))) : null)
            ->filter()
            ->implode("\n\n");

        return mb_substr("Cargo: {$job->title}\nEmpresa: {$job->company->name}\nNível: ".($job->experience_level?->label() ?? 'não informado')."\n\n{$sections}", 0, self::LIMIT);
    }
}

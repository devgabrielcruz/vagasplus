<?php

namespace App\Support;

class Seo
{
    public static function make(
        string $title,
        string $description,
        ?string $canonical = null,
        bool $index = true,
        string $type = 'website',
        ?string $image = null,
        ?array $jsonLd = null,
        ?array $prev = null,
    ): array {
        $site = config('app.name');

        return [
            'title' => str_contains($title, $site) ? $title : "{$title} | {$site}",
            'description' => mb_substr(trim(preg_replace('/\s+/', ' ', strip_tags($description))), 0, 160),
            'canonical' => $canonical ?? url()->current(),
            'robots' => $index ? 'index,follow' : 'noindex,follow',
            'type' => $type,
            'image' => $image,
            'site' => $site,
            'json_ld' => $jsonLd ? JobPostingSchema::toJson($jsonLd) : null,
        ];
    }
}

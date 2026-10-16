<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Location;
use Illuminate\Support\Str;

class SlugGenerator
{
    /**
     * Slug de vaga: "titulo-empresa-a1b2c3". O sufixo aleatório evita colisões entre
     * vagas com o mesmo título e torna a URL estável (não muda ao editar o título).
     */
    public function forJob(string $title, string $company): string
    {
        $base = Str::limit(Str::slug("{$title} {$company}"), 140, '');
        $base = rtrim($base, '-') ?: 'vaga';

        do {
            $slug = $base.'-'.Str::lower(Str::random(6));
        } while (JobPosting::where('slug', $slug)->exists());

        return $slug;
    }

    /** Slug único para modelos simples (categoria, empresa, localidade): acrescenta -2, -3... */
    public function unique(string $modelClass, string $text, ?int $ignoreId = null): string
    {
        $base = Str::slug($text) ?: 'item';
        $slug = $base;
        $i = 2;

        while ($modelClass::where('slug', $slug)->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    public function location(string $city, string $state): string
    {
        return $this->unique(Location::class, "{$city} {$state}");
    }

    public function company(string $name): string
    {
        return $this->unique(Company::class, $name);
    }

    public function category(string $name, ?int $ignoreId = null): string
    {
        return $this->unique(Category::class, $name, $ignoreId);
    }
}

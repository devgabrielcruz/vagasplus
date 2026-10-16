<?php

namespace App\Support;

use Illuminate\Contracts\Database\Query\Builder;

/**
 * LIKE com escape portátil (SQLite e MySQL): "!" como caractere de escape.
 */
class Like
{
    public static function contains(string $value): string
    {
        return '%'.str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $value).'%';
    }

    /** Adiciona "coluna LIKE ? ESCAPE '!'" (OR) à consulta. */
    public static function orWhere(Builder $query, string $column, string $pattern): Builder
    {
        return $query->orWhereRaw("{$column} LIKE ? ESCAPE '!'", [$pattern]);
    }

    public static function where(Builder $query, string $column, string $pattern): Builder
    {
        return $query->whereRaw("{$column} LIKE ? ESCAPE '!'", [$pattern]);
    }
}

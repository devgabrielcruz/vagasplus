<?php

namespace App\Models;

use App\Models\Concerns\HasLogo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Canal pelo qual a empresa recebe candidaturas (Gupy, LinkedIn, e-mail...).
 */
class Platform extends Model
{
    use HasFactory, HasLogo;

    protected $fillable = ['name', 'slug', 'color', 'logo_url', 'uses_email', 'is_active', 'position'];

    protected function casts(): array
    {
        return ['uses_email' => 'boolean', 'is_active' => 'boolean', 'position' => 'integer'];
    }

    public function jobPostings(): HasMany
    {
        return $this->hasMany(JobPosting::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}

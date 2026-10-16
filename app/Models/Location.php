<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['city', 'state', 'slug'];

    public function jobPostings(): HasMany
    {
        return $this->hasMany(JobPosting::class);
    }

    public function getLabelAttribute(): string
    {
        return "{$this->city}, {$this->state}";
    }
}

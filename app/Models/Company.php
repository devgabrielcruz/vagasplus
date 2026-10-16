<?php

namespace App\Models;

use App\Models\Concerns\HasLogo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory, HasLogo;

    protected $fillable = ['name', 'slug', 'website_url', 'logo_url', 'logo_path', 'about'];

    public function jobPostings(): HasMany
    {
        return $this->hasMany(JobPosting::class);
    }
}

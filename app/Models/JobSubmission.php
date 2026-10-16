<?php

namespace App\Models;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\SalaryPeriod;
use App\Enums\WorkMode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Vaga enviada por visitante/empresa pelo site. Só vira JobPosting (rascunho) quando um administrador aprova.
 */
class JobSubmission extends Model
{
    use HasFactory;

    public const PENDING = 'pending';
    public const APPROVED = 'approved';
    public const REJECTED = 'rejected';

    protected $fillable = [
        'submitter_name', 'submitter_email', 'submitter_phone', 'submitter_ip',
        'company_name', 'company_website_url', 'company_logo_path',
        'title', 'category_id', 'work_mode', 'employment_type', 'experience_level', 'city', 'state',
        'description', 'requirements', 'benefits', 'salary_min', 'salary_max', 'salary_period',
        'platform_id', 'apply_url', 'apply_email',
    ];

    protected function casts(): array
    {
        return [
            'work_mode' => WorkMode::class,
            'employment_type' => EmploymentType::class,
            'experience_level' => ExperienceLevel::class,
            'salary_period' => SalaryPeriod::class,
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'reviewed_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function isPending(): bool
    {
        return $this->status === self::PENDING;
    }
}

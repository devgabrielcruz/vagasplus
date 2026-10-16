<?php

namespace App\Models;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\JobStatus;
use App\Enums\SalaryPeriod;
use App\Enums\WorkMode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class JobPosting extends Model
{
    use HasFactory;

    /**
     * Campos de ciclo de vida (status, datas de publicação/expiração) ficam FORA do
     * mass assignment: só podem ser alterados por App\Services\JobLifecycle.
     */
    protected $fillable = [
        'title', 'slug', 'company_id', 'category_id', 'location_id',
        'work_mode', 'employment_type', 'experience_level',
        'description', 'responsibilities', 'requirements', 'nice_to_have', 'benefits', 'additional_info',
        'salary_min', 'salary_max', 'salary_currency', 'salary_period',
        'source_name', 'source_url', 'apply_url', 'apply_email', 'platform_id',
        'is_featured', 'needs_review', 'source_published_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => JobStatus::class,
            'work_mode' => WorkMode::class,
            'employment_type' => EmploymentType::class,
            'experience_level' => ExperienceLevel::class,
            'salary_period' => SalaryPeriod::class,
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'is_featured' => 'boolean',
            'needs_review' => 'boolean',
            'source_published_at' => 'datetime',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
            'expired_at' => 'datetime',
            'archived_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(JobPostingEvent::class)->latest('created_at')->latest('id');
    }

    /*
    |--------------------------------------------------------------------------
    | Regra única de "vaga ativa"
    |--------------------------------------------------------------------------
    | Uma vaga só é pública se: publicada (ou agendada cujo horário já chegou),
    | com published_at <= agora e expires_at > agora. A verificação é feita na
    | consulta, então não depende do scheduler ter rodado.
    */
    public function scopeActive(Builder $query, ?Carbon $now = null): Builder
    {
        $now ??= now();

        return $query
            ->whereIn('status', [JobStatus::Published->value, JobStatus::Scheduled->value])
            ->where('published_at', '<=', $now)
            ->where('expires_at', '>', $now);
    }

    public function isActive(?Carbon $now = null): bool
    {
        $now ??= now();

        return in_array($this->status, [JobStatus::Published, JobStatus::Scheduled], true)
            && $this->published_at !== null && $this->published_at->lte($now)
            && $this->expires_at !== null && $this->expires_at->gt($now);
    }

    /**
     * Status efetivo: considera o relógio mesmo que o scheduler ainda não tenha atualizado o registro.
     */
    public function effectiveStatus(?Carbon $now = null): JobStatus
    {
        $now ??= now();

        if ($this->status === JobStatus::Published && $this->expires_at && $this->expires_at->lte($now)) {
            return JobStatus::Expired;
        }

        if ($this->status === JobStatus::Scheduled && $this->published_at && $this->published_at->lte($now)) {
            return $this->expires_at && $this->expires_at->lte($now) ? JobStatus::Expired : JobStatus::Published;
        }

        return $this->status;
    }

    public function hasSalary(): bool
    {
        return $this->salary_min !== null || $this->salary_max !== null;
    }
}

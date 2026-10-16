<?php

namespace Database\Factories;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\JobStatus;
use App\Enums\SalaryPeriod;
use App\Enums\WorkMode;
use App\Models\Category;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Location;
use App\Models\Platform;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<JobPosting> */
class JobPostingFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->jobTitle();

        return [
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(6)),
            'title' => $title,
            'company_id' => Company::factory(),
            'category_id' => Category::factory(),
            'location_id' => Location::factory(),
            'work_mode' => WorkMode::Onsite,
            'employment_type' => EmploymentType::Clt,
            'experience_level' => ExperienceLevel::Mid,
            'description' => '<p>'.fake()->paragraph().'</p>',
            'apply_url' => 'https://empresa.example.com/carreiras/'.fake()->numerify('####'),
            'platform_id' => Platform::factory(),
            'status' => JobStatus::Published,
            'published_at' => now()->subDay(),
            'expires_at' => now()->addDays(29),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => JobStatus::Draft, 'published_at' => null, 'expires_at' => null]);
    }

    public function scheduled(): static
    {
        return $this->state(['status' => JobStatus::Scheduled, 'published_at' => now()->addDays(2), 'expires_at' => now()->addDays(32)]);
    }

    public function expired(): static
    {
        return $this->state(['status' => JobStatus::Expired, 'published_at' => now()->subDays(40), 'expires_at' => now()->subDays(10), 'expired_at' => now()->subDays(10)]);
    }

    /** Venceu pelo relógio, mas o scheduler ainda não marcou como expirada. */
    public function stale(): static
    {
        return $this->state(['status' => JobStatus::Published, 'published_at' => now()->subDays(40), 'expires_at' => now()->subMinute()]);
    }

    public function archived(): static
    {
        return $this->state(['status' => JobStatus::Archived, 'archived_at' => now()]);
    }

    public function remote(): static
    {
        return $this->state(['work_mode' => WorkMode::Remote, 'location_id' => null]);
    }

    public function withSalary(float $min = 3000, float $max = 5000): static
    {
        return $this->state(['salary_min' => $min, 'salary_max' => $max, 'salary_period' => SalaryPeriod::Month, 'salary_currency' => 'BRL']);
    }
}

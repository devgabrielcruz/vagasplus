<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\JobSubmission;
use App\Models\Platform;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<JobSubmission> */
class JobSubmissionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'status' => 'pending',
            'submitter_name' => fake()->name(),
            'submitter_email' => fake()->safeEmail(),
            'company_name' => fake()->company(),
            'title' => fake()->jobTitle(),
            'category_id' => Category::factory(),
            'work_mode' => 'remote',
            'employment_type' => 'clt',
            'description' => '<p>'.fake()->paragraph().'</p>',
            'platform_id' => Platform::factory(),
            'apply_url' => 'https://empresa.example.com/vaga/'.fake()->numerify('###'),
        ];
    }
}

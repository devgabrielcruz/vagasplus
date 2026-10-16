<?php

namespace Database\Factories;

use App\Models\Platform;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Platform> */
class PlatformFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->word().' RH';

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('###'),
            'color' => '#2563eb',
            'uses_email' => false,
            'is_active' => true,
            'position' => 0,
        ];
    }

    public function email(): static
    {
        return $this->state(['name' => 'E-mail', 'slug' => 'email', 'uses_email' => true]);
    }
}

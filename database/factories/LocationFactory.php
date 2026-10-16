<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Location> */
class LocationFactory extends Factory
{
    public function definition(): array
    {
        $city = fake()->unique()->city();
        $state = fake()->randomElement(['SP', 'RJ', 'MG', 'PR', 'RS', 'BA']);

        return ['city' => $city, 'state' => $state, 'slug' => Str::slug("{$city} {$state}").'-'.fake()->unique()->numerify('###')];
    }
}

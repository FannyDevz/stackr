<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PerspectiveFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->words(2, true),
            'icon' => 'star',
            'filter_rules' => ['availability' => 'available'],
            'position' => 0,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'note' => fake()->optional()->paragraph(),
            'type' => fake()->randomElement(['sequential', 'parallel', 'single_actions']),
            'status' => 'active',
            'flagged' => false,
            'position' => 0,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'note' => fake()->optional()->paragraph(),
            'status' => 'todo',
            'flagged' => false,
            'position' => 0,
        ];
    }

    public function done(): static
    {
        return $this->state(fn () => ['status' => 'done', 'completed_at' => now()]);
    }

    public function flagged(): static
    {
        return $this->state(fn () => ['flagged' => true]);
    }
}

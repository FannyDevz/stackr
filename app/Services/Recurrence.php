<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Carbon;

class Recurrence
{
    /**
     * When a repeating task is completed, create its next occurrence with the
     * defer/due dates advanced by the rule. Tags, project, parent, note, flag
     * and the repeat rule itself are carried over.
     *
     * repeat_rule shape: { frequency: daily|weekly|monthly|yearly, interval: int }
     */
    public static function spawnNext(Task $task): ?Task
    {
        $rule = $task->repeat_rule;
        if (! is_array($rule) || empty($rule['frequency'])) {
            return null;
        }

        $interval = max(1, (int) ($rule['interval'] ?? 1));

        $advance = function ($date) use ($rule, $interval): ?string {
            if (! $date) {
                return null;
            }
            $d = $date instanceof Carbon ? $date->copy() : Carbon::parse($date);
            $next = match ($rule['frequency']) {
                'daily' => $d->addDays($interval),
                'weekly' => $d->addWeeks($interval),
                'monthly' => $d->addMonthsNoOverflow($interval),
                'yearly' => $d->addYearsNoOverflow($interval),
                default => null,
            };

            return $next?->toDateString();
        };

        $next = $task->replicate();
        $next->status = 'todo';
        $next->completed_at = null;
        $next->defer_date = $advance($task->defer_date);
        $next->due_date = $advance($task->due_date);
        $next->save();

        $next->tags()->sync($task->tags()->pluck('tags.id')->all());

        return $next;
    }
}

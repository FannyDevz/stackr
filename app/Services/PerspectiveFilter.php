<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;

class PerspectiveFilter
{
    /**
     * Apply an OmniFocus-style perspective ruleset to a Task query builder.
     *
     * Supported rules:
     *  - availability: available|remaining|completed|all
     *  - flagged: bool
     *  - inbox: bool  (tasks with no project)
     *  - project_id: int
     *  - project_ids: int[]  (tasks in any of these projects)
     *  - tag_ids: int[]
     *  - due_within_days: int
     *  - status: todo|done|dropped
     *  - search: string
     */
    public static function apply($query, ?array $rules, ?string $today = null)
    {
        $rules ??= [];

        switch ($rules['availability'] ?? 'remaining') {
            case 'available':
                $query->available($today);
                break;
            case 'completed':
                $query->where('status', 'done');
                break;
            case 'all':
                break;
            case 'remaining':
            default:
                $query->where('status', 'todo');
                break;
        }

        if (! empty($rules['flagged'])) {
            $query->where('flagged', true);
        }

        if (! empty($rules['min_priority'])) {
            $query->whereIn('priority', Priority::atLeast($rules['min_priority']));
        }

        if (! empty($rules['inbox'])) {
            $query->whereNull('project_id');
        }

        if (! empty($rules['project_id'])) {
            $query->where('project_id', $rules['project_id']);
        }

        if (! empty($rules['project_ids']) && is_array($rules['project_ids'])) {
            $query->whereIn('project_id', $rules['project_ids']);
        }

        if (! empty($rules['status'])) {
            $query->where('status', $rules['status']);
        }

        if (! empty($rules['tag_ids']) && is_array($rules['tag_ids'])) {
            $query->whereHas('tags', fn (Builder $q) => $q->whereIn('tags.id', $rules['tag_ids']));
        }

        if (isset($rules['due_within_days'])) {
            $query->whereNotNull('due_date')
                ->whereDate('due_date', '<=', now()->addDays((int) $rules['due_within_days']));
        }

        if (! empty($rules['search'])) {
            $s = $rules['search'];
            $query->where(fn (Builder $q) => $q->where('title', 'like', "%{$s}%")->orWhere('note', 'like', "%{$s}%"));
        }

        return $query;
    }
}

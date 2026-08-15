<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'project_id', 'parent_id', 'title', 'note', 'status',
        'completed_at', 'defer_date', 'due_date', 'due_notified_at', 'flagged', 'priority', 'color',
        'estimated_minutes', 'repeat_rule', 'position',
    ];

    protected $attributes = [
        'status' => 'todo',
        'flagged' => false,
        'priority' => 'none',
        'position' => 0,
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
            'defer_date' => 'date',
            'due_date' => 'date',
            'due_notified_at' => 'datetime',
            'flagged' => 'boolean',
            'estimated_minutes' => 'integer',
            'repeat_rule' => 'array',
            'position' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_id')->orderBy('position');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'task_tag');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->latest();
    }

    /**
     * "Available" = actionable now: not completed/dropped and defer date has arrived.
     * Pass $today (Y-m-d in the user's timezone) for timezone-correct comparisons.
     */
    public function scopeAvailable(Builder $query, ?string $today = null): Builder
    {
        $today ??= now()->toDateString();

        return $query->where('status', 'todo')
            ->where(function (Builder $q) use ($today) {
                $q->whereNull('defer_date')->orWhereDate('defer_date', '<=', $today);
            });
    }
}

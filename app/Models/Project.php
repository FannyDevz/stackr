<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'folder_id', 'title', 'note', 'type', 'status',
        'defer_date', 'due_date', 'flagged', 'review_interval_days',
        'last_reviewed_at', 'next_review_at', 'completed_at', 'position',
    ];

    protected $attributes = [
        'type' => 'parallel',
        'status' => 'active',
        'flagged' => false,
        'position' => 0,
    ];

    protected function casts(): array
    {
        return [
            'defer_date' => 'date',
            'due_date' => 'date',
            'flagged' => 'boolean',
            'review_interval_days' => 'integer',
            'last_reviewed_at' => 'datetime',
            'next_review_at' => 'datetime',
            'completed_at' => 'datetime',
            'position' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}

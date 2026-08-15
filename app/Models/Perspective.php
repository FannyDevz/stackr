<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Perspective extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'icon', 'filter_rules', 'sort_rule', 'position'];

    protected function casts(): array
    {
        return [
            'filter_rules' => 'array',
            'position' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

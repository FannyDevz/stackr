<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Bumps a per-user "sync version" whenever any of the user's data changes,
 * so connected SSE streams can tell clients to refetch. Attached to every
 * user-owned model in AppServiceProvider.
 */
class SyncObserver
{
    public static function versionKey(int $userId): string
    {
        return "sync:user:{$userId}";
    }

    public function saved(Model $model): void
    {
        $this->bump($model);
    }

    public function deleted(Model $model): void
    {
        $this->bump($model);
    }

    public function restored(Model $model): void
    {
        $this->bump($model);
    }

    protected function bump(Model $model): void
    {
        $userId = $model->getAttribute('user_id');
        if (! $userId) {
            return;
        }

        $key = self::versionKey((int) $userId);
        // get+put keeps this store-agnostic; the value only needs to change.
        Cache::put($key, ((int) Cache::get($key, 0)) + 1, now()->addDay());
    }
}

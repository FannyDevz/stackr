<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\Folder;
use App\Models\Perspective;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Observers\SyncObserver;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Password-reset emails link to the SPA's reset page.
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.url').'/reset-password?token='.$token.'&email='.urlencode($user->email);
        });

        // Bump a per-user sync version on any data change (drives real-time SSE).
        foreach ([Task::class, Project::class, Tag::class, Folder::class, Perspective::class, Comment::class] as $model) {
            $model::observe(SyncObserver::class);
        }
    }
}

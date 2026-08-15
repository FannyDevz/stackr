<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Notify users about tasks that have become due (requires `php artisan schedule:run` via cron).
Schedule::command('tasks:notify-due')->everyFifteenMinutes()->withoutOverlapping();

<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\PerspectiveController;
use App\Http\Controllers\PortabilityController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PushSubscriptionController;
use App\Http\Controllers\SyncController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\ViewController;
use Illuminate\Support\Facades\Route;

// Public auth endpoints (stateful, CSRF-protected via Sanctum SPA).
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    // Session / account
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/password', [AuthController::class, 'updatePassword']);
    Route::put('/settings', [AuthController::class, 'updateSettings']);

    // Data backup / restore
    Route::get('/export', [PortabilityController::class, 'export']);
    Route::post('/import', [PortabilityController::class, 'import']);

    // Real-time sync (Server-Sent Events)
    Route::get('/stream', [SyncController::class, 'stream']);

    // Web push notifications
    Route::get('/push/key', [PushSubscriptionController::class, 'key']);
    Route::post('/push/subscribe', [PushSubscriptionController::class, 'store']);
    Route::post('/push/unsubscribe', [PushSubscriptionController::class, 'destroy']);

    // Organisational structure
    Route::apiResource('folders', FolderController::class);
    Route::apiResource('tags', TagController::class);

    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/review', [ProjectController::class, 'review']);

    // Project templates
    Route::get('templates', [TemplateController::class, 'index']);
    Route::post('templates', [TemplateController::class, 'store']);
    Route::post('templates/{template}/apply', [TemplateController::class, 'apply']);
    Route::delete('templates/{template}', [TemplateController::class, 'destroy']);

    // Tasks — specific routes before the resource so they are not swallowed by {task}.
    Route::post('tasks/reorder', [TaskController::class, 'reorder']);
    Route::post('tasks/bulk', [TaskController::class, 'bulk']);
    Route::post('tasks/{id}/restore', [TaskController::class, 'restore']);
    Route::post('tasks/{task}/complete', [TaskController::class, 'complete']);
    Route::apiResource('tasks', TaskController::class);

    // Markdown comments on a task.
    Route::apiResource('tasks.comments', CommentController::class)->shallow()->except(['show']);

    // Perspectives (saved filters) + their execution.
    Route::get('perspectives/{perspective}/tasks', [PerspectiveController::class, 'tasks']);
    Route::apiResource('perspectives', PerspectiveController::class);

    // Built-in perspectives / views.
    Route::get('views/inbox', [ViewController::class, 'inbox']);
    Route::get('views/today', [ViewController::class, 'today']);
    Route::get('views/forecast', [ViewController::class, 'forecast']);
    Route::get('views/flagged', [ViewController::class, 'flagged']);
    Route::get('views/review', [ViewController::class, 'review']);
    Route::get('views/completed', [ViewController::class, 'completed']);
    Route::get('views/by-project', [ViewController::class, 'byProject']);
    Route::get('views/counts', [ViewController::class, 'counts']);
});

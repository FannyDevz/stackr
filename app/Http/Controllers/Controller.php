<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

abstract class Controller
{
    /**
     * Ensure the given model belongs to the authenticated user.
     */
    protected function authorizeOwner(Model $model, Request $request): void
    {
        abort_if($model->getAttribute('user_id') !== $request->user()->id, 403, 'This action is unauthorized.');
    }
}

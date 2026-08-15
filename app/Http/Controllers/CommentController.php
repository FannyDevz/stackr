<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Task $task)
    {
        $this->authorizeOwner($task, $request);

        return CommentResource::collection($task->comments);
    }

    public function store(Request $request, Task $task)
    {
        $this->authorizeOwner($task, $request);

        $data = $request->validate([
            'body' => 'required|string',
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        return new CommentResource($comment);
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorizeOwner($comment, $request);

        $data = $request->validate([
            'body' => 'required|string',
        ]);

        $comment->update($data);

        return new CommentResource($comment);
    }

    public function destroy(Request $request, Comment $comment)
    {
        $this->authorizeOwner($comment, $request);
        $comment->delete();

        return response()->noContent();
    }
}

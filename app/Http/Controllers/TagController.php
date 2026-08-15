<?php

namespace App\Http\Controllers;

use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TagController extends Controller
{
    public function index(Request $request)
    {
        return TagResource::collection(
            $request->user()->tags()->withCount('tasks')->orderBy('position')->orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);

        return new TagResource($request->user()->tags()->create($data));
    }

    public function show(Request $request, Tag $tag)
    {
        $this->authorizeOwner($tag, $request);

        return new TagResource($tag->loadCount('tasks'));
    }

    public function update(Request $request, Tag $tag)
    {
        $this->authorizeOwner($tag, $request);
        $tag->update($this->validateData($request, false));

        return new TagResource($tag);
    }

    public function destroy(Request $request, Tag $tag)
    {
        $this->authorizeOwner($tag, $request);
        $tag->delete();

        return response()->noContent();
    }

    private function validateData(Request $request, bool $creating = true): array
    {
        return $request->validate([
            'name' => ($creating ? 'required' : 'sometimes').'|string|max:255',
            'color' => 'nullable|in:red,orange,amber,green,teal,sky,blue,violet,pink',
            'parent_id' => ['nullable', 'integer', Rule::exists('tags', 'id')->where('user_id', $request->user()->id)],
            'position' => 'integer',
        ]);
    }
}

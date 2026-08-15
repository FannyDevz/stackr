<?php

namespace App\Http\Controllers;

use App\Http\Resources\FolderResource;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FolderController extends Controller
{
    public function index(Request $request)
    {
        return FolderResource::collection(
            $request->user()->folders()->withCount('projects')->orderBy('position')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'integer',
        ]);

        return new FolderResource($request->user()->folders()->create($data));
    }

    public function show(Request $request, Folder $folder)
    {
        $this->authorizeOwner($folder, $request);

        return new FolderResource($folder->loadCount('projects'));
    }

    public function update(Request $request, Folder $folder)
    {
        $this->authorizeOwner($folder, $request);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'integer',
        ]);

        $folder->update($data);

        return new FolderResource($folder);
    }

    public function destroy(Request $request, Folder $folder)
    {
        $this->authorizeOwner($folder, $request);
        $folder->delete();

        return response()->noContent();
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => ['integer', Rule::exists('folders', 'id')->where('user_id', $request->user()->id)],
        ]);

        foreach ($data['ids'] as $i => $id) {
            $request->user()->folders()->where('id', $id)->update(['position' => $i]);
        }

        return response()->noContent();
    }
}

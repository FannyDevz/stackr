<?php

namespace App\Http\Controllers;

use App\Http\Resources\FolderResource;
use App\Models\Folder;
use Illuminate\Http\Request;

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
}

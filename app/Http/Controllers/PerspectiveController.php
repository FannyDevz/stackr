<?php

namespace App\Http\Controllers;

use App\Http\Resources\PerspectiveResource;
use App\Http\Resources\TaskResource;
use App\Models\Perspective;
use App\Services\PerspectiveFilter;
use Illuminate\Http\Request;

class PerspectiveController extends Controller
{
    public function index(Request $request)
    {
        return PerspectiveResource::collection(
            $request->user()->perspectives()->orderBy('position')->orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        return new PerspectiveResource(
            $request->user()->perspectives()->create($this->validateData($request))
        );
    }

    public function show(Request $request, Perspective $perspective)
    {
        $this->authorizeOwner($perspective, $request);

        return new PerspectiveResource($perspective);
    }

    public function update(Request $request, Perspective $perspective)
    {
        $this->authorizeOwner($perspective, $request);
        $perspective->update($this->validateData($request, false));

        return new PerspectiveResource($perspective);
    }

    public function destroy(Request $request, Perspective $perspective)
    {
        $this->authorizeOwner($perspective, $request);
        $perspective->delete();

        return response()->noContent();
    }

    /**
     * Execute the perspective's saved filter and return matching tasks.
     */
    public function tasks(Request $request, Perspective $perspective)
    {
        $this->authorizeOwner($perspective, $request);

        $query = $request->user()->tasks()->with('tags')->withCount('children');
        PerspectiveFilter::apply($query, $perspective->filter_rules, $request->user()->todayDate());

        $query->orderBy('position')->orderBy('created_at');

        return TaskResource::collection($query->get());
    }

    private function validateData(Request $request, bool $creating = true): array
    {
        return $request->validate([
            'name' => ($creating ? 'required' : 'sometimes').'|string|max:255',
            'icon' => 'nullable|string|max:64',
            'filter_rules' => 'nullable|array',
            'sort_rule' => 'nullable|string|max:64',
            'position' => 'integer',
        ]);
    }
}

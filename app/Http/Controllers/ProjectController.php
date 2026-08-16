<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $today = $request->user()->todayDate();
        $query = $request->user()->projects()
            ->withCount(['tasks', 'tasks as remaining_count' => fn ($q) => $q->available($today)]);

        if ($request->filled('folder_id')) {
            $query->where('folder_id', $request->folder_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('flagged')) {
            $query->where('flagged', $request->boolean('flagged'));
        }

        // Archived projects are hidden unless explicitly requested.
        $archived = $request->query('archived');
        if ($archived === 'only') {
            $query->whereNotNull('archived_at');
        } elseif ($archived !== 'all') {
            $query->whereNull('archived_at');
        }

        return ProjectResource::collection($query->orderBy('position')->orderBy('title')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $data = $this->applyReviewSchedule($data);

        return new ProjectResource($request->user()->projects()->create($data));
    }

    public function show(Request $request, Project $project)
    {
        $this->authorizeOwner($project, $request);

        $today = $request->user()->todayDate();
        $project->load([
            'tasks' => fn ($q) => $q->whereNull('parent_id')->orderBy('position'),
            'tasks.tags',
            'tasks.children.tags',
        ])->loadCount(['tasks', 'tasks as remaining_count' => fn ($q) => $q->available($today)]);

        return new ProjectResource($project);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorizeOwner($project, $request);

        $data = $this->validateData($request, false);

        // Mark completion timestamp when status flips to done.
        if (($data['status'] ?? null) === 'done' && $project->status !== 'done') {
            $data['completed_at'] = now();
        } elseif (array_key_exists('status', $data) && $data['status'] !== 'done') {
            $data['completed_at'] = null;
        }

        $project->update($data);

        return new ProjectResource($project);
    }

    public function destroy(Request $request, Project $project)
    {
        $this->authorizeOwner($project, $request);
        $project->delete();

        return response()->noContent();
    }

    /**
     * Mark a project as reviewed and schedule the next review.
     */
    public function review(Request $request, Project $project)
    {
        $this->authorizeOwner($project, $request);

        $project->last_reviewed_at = now();
        if ($project->review_interval_days) {
            $project->next_review_at = now()->addDays($project->review_interval_days);
        }
        $project->save();

        return new ProjectResource($project);
    }

    private function applyReviewSchedule(array $data): array
    {
        if (! empty($data['review_interval_days']) && empty($data['next_review_at'])) {
            $data['next_review_at'] = now()->addDays((int) $data['review_interval_days']);
        }

        return $data;
    }

    private function validateData(Request $request, bool $creating = true): array
    {
        return $request->validate([
            'title' => ($creating ? 'required' : 'sometimes').'|string|max:255',
            'folder_id' => ['nullable', 'integer', Rule::exists('folders', 'id')->where('user_id', $request->user()->id)],
            'note' => 'nullable|string',
            'type' => 'in:sequential,parallel,single_actions',
            'status' => 'in:active,on_hold,done,dropped',
            'defer_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'flagged' => 'boolean',
            'review_interval_days' => 'nullable|integer|min:1',
            'position' => 'integer',
        ]);
    }

    public function archive(Request $request, Project $project)
    {
        $this->authorizeOwner($project, $request);
        $project->update(['archived_at' => now()]);

        return $this->withCounts($project);
    }

    public function unarchive(Request $request, Project $project)
    {
        $this->authorizeOwner($project, $request);
        $project->update(['archived_at' => null]);

        return $this->withCounts($project);
    }

    private function withCounts(Project $project): ProjectResource
    {
        return new ProjectResource(
            $project->loadCount(['tasks', 'tasks as remaining_count' => fn ($q) => $q->where('status', 'todo')])
        );
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => ['integer', Rule::exists('projects', 'id')->where('user_id', $request->user()->id)],
        ]);

        foreach ($data['ids'] as $i => $id) {
            $request->user()->projects()->where('id', $id)->update(['position' => $i]);
        }

        return response()->noContent();
    }
}

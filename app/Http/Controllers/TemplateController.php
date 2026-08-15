<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'data' => $request->user()->templates()->latest()->get(['id', 'name', 'created_at']),
        ]);
    }

    /** Save an existing project (its tasks + subtasks) as a reusable template. */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'project_id' => ['required', Rule::exists('projects', 'id')->where('user_id', $request->user()->id)],
        ]);

        $project = $request->user()->projects()
            ->with([
                'tasks' => fn ($q) => $q->whereNull('parent_id')->orderBy('position'),
                'tasks.children' => fn ($q) => $q->orderBy('position'),
            ])
            ->findOrFail($data['project_id']);

        $tasks = $project->tasks->map(fn ($t) => [
            'title' => $t->title,
            'note' => $t->note,
            'priority' => $t->priority,
            'color' => $t->color,
            'children' => $t->children->map(fn ($c) => [
                'title' => $c->title,
                'note' => $c->note,
                'priority' => $c->priority,
                'color' => $c->color,
            ])->all(),
        ])->all();

        $template = $request->user()->templates()->create([
            'name' => $data['name'],
            'data' => ['type' => $project->type, 'note' => $project->note, 'tasks' => $tasks],
        ]);

        return response()->json(['data' => ['id' => $template->id, 'name' => $template->name]], 201);
    }

    /** Create a new project from a template. */
    public function apply(Request $request, Template $template)
    {
        $this->authorizeOwner($template, $request);

        $title = $request->input('title') ?: $template->name;
        $d = $template->data;

        $project = $request->user()->projects()->create([
            'title' => $title,
            'type' => $d['type'] ?? 'parallel',
            'note' => $d['note'] ?? null,
            'status' => 'active',
        ]);

        foreach ($d['tasks'] ?? [] as $i => $t) {
            $parent = $request->user()->tasks()->create([
                'project_id' => $project->id,
                'title' => $t['title'] ?? 'Task',
                'note' => $t['note'] ?? null,
                'priority' => $t['priority'] ?? 'none',
                'color' => $t['color'] ?? null,
                'position' => $i,
            ]);
            foreach ($t['children'] ?? [] as $j => $c) {
                $request->user()->tasks()->create([
                    'project_id' => $project->id,
                    'parent_id' => $parent->id,
                    'title' => $c['title'] ?? 'Task',
                    'note' => $c['note'] ?? null,
                    'priority' => $c['priority'] ?? 'none',
                    'color' => $c['color'] ?? null,
                    'position' => $j,
                ]);
            }
        }

        return new ProjectResource($project);
    }

    public function destroy(Request $request, Template $template)
    {
        $this->authorizeOwner($template, $request);
        $template->delete();

        return response()->noContent();
    }
}

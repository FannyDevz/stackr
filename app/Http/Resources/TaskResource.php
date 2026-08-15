<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'parent_id' => $this->parent_id,
            'title' => $this->title,
            'note' => $this->note,
            'status' => $this->status,
            'completed_at' => $this->completed_at,
            'defer_date' => $this->defer_date?->toDateString(),
            'due_date' => $this->due_date?->toDateString(),
            'flagged' => $this->flagged,
            'priority' => $this->priority,
            'color' => $this->color,
            'estimated_minutes' => $this->estimated_minutes,
            'repeat_rule' => $this->repeat_rule,
            'position' => $this->position,
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'children' => TaskResource::collection($this->whenLoaded('children')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'children_count' => $this->whenCounted('children'),
            'project' => new ProjectResource($this->whenLoaded('project')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

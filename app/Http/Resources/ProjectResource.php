<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'folder_id' => $this->folder_id,
            'title' => $this->title,
            'note' => $this->note,
            'type' => $this->type,
            'status' => $this->status,
            'defer_date' => $this->defer_date?->toDateString(),
            'due_date' => $this->due_date?->toDateString(),
            'flagged' => $this->flagged,
            'review_interval_days' => $this->review_interval_days,
            'last_reviewed_at' => $this->last_reviewed_at,
            'next_review_at' => $this->next_review_at,
            'completed_at' => $this->completed_at,
            'position' => $this->position,
            'tasks_count' => $this->whenCounted('tasks'),
            'remaining_count' => $this->when(isset($this->remaining_count), fn () => (int) $this->remaining_count),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

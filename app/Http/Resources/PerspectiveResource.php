<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerspectiveResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'icon' => $this->icon,
            'filter_rules' => $this->filter_rules ?? (object) [],
            'sort_rule' => $this->sort_rule,
            'position' => $this->position,
        ];
    }
}

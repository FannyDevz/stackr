<?php

namespace App\Services;

class Priority
{
    /** Ordered from lowest to highest. */
    public const LEVELS = ['none', 'low', 'medium', 'high'];

    /**
     * Return every priority level >= the given minimum (for "at least" filters).
     */
    public static function atLeast(string $min): array
    {
        $index = array_search($min, self::LEVELS, true);

        return $index === false ? self::LEVELS : array_slice(self::LEVELS, $index);
    }
}

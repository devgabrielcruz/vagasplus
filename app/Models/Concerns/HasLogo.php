<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Storage;

/**
 * Logo por upload (logo_path, disco "public") ou por URL/caminho (logo_url).
 * O upload tem prioridade sobre a URL.
 */
trait HasLogo
{
    public function getLogoSrcAttribute(): ?string
    {
        if ($this->logo_path) {
            return Storage::disk('public')->url($this->logo_path);
        }

        return $this->logo_url ?: null;
    }

    /** URL absoluta (para dados estruturados). */
    public function getLogoAbsoluteUrlAttribute(): ?string
    {
        $src = $this->logo_src;

        return $src && str_starts_with($src, '/') ? url($src) : $src;
    }
}

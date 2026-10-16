<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Guarda logos enviados pelo painel no disco "public" (rode `php artisan storage:link`).
 * Aceita apenas PNG/JPG/WEBP (validado nas requisições); SVG enviado por usuário é evitado
 * por poder conter scripts. Logos em SVG entram apenas como arquivo do projeto ou URL.
 */
class LogoStorage
{
    public function store(UploadedFile $file, string $directory): string
    {
        return $file->store("logos/{$directory}", 'public');
    }

    public function delete(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }

    /** Substitui o logo antigo (se houver) pelo novo e devolve o novo caminho. */
    public function replace(?string $oldPath, UploadedFile $file, string $directory): string
    {
        $new = $this->store($file, $directory);
        $this->delete($oldPath);

        return $new;
    }
}

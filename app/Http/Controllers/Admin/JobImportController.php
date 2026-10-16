<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Import\GeminiExtractor;
use App\Services\Import\ImportException;
use App\Services\Import\JobImporter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobImportController extends Controller
{
    public function __invoke(Request $request, JobImporter $importer): JsonResponse
    {
        $data = $request->validate([
            'source' => ['required', 'string', 'min:8', 'max:60000'],
            'url' => ['nullable', 'string', 'max:1000', new \App\Rules\SafeUrl(false)],
        ], [], ['source' => 'link ou texto', 'url' => 'link da vaga']);

        try {
            return response()->json($importer->import($data['source'], $data['url'] ?? null));
        } catch (ImportException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** Informa ao painel se a IA de reserva está configurada. */
    public static function aiConfigured(): bool
    {
        return app(GeminiExtractor::class)->configured();
    }
}

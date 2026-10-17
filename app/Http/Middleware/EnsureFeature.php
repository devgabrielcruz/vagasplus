<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Esconde (404) as rotas de uma feature desligada em config/features.php. Uso: ->middleware('feature:job_submissions'). */
class EnsureFeature
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        abort_unless(config("features.{$feature}"), 404);

        return $next($request);
    }
}

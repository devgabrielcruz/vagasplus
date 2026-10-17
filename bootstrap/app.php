<?php

use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureFeature;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Atrás de um proxy HTTPS (Railway, Render...), confia nos cabeçalhos X-Forwarded-* para gerar URLs https.
        // Só ativa quando TRUSTED_PROXIES está definido (ex.: "*"); em desenvolvimento local nada muda.
        $middleware->trustProxies(at: env('TRUSTED_PROXIES') ?: null);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            SecurityHeaders::class,
        ]);

        $middleware->alias(['admin' => EnsureAdmin::class, 'feature' => EnsureFeature::class]);
        // Visitante sem login: painel → login da equipe; resto do site → login do candidato.
        $middleware->redirectGuestsTo(fn (Request $request) => $request->is('admin', 'admin/*') ? route('admin.login') : route('login'));
        $middleware->redirectUsersTo(fn (Request $request) => $request->user()?->is_admin ? route('admin.dashboard') : route('account'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Páginas de erro amigáveis em produção (sem stack trace).
        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            $status = $response->getStatusCode();

            if (! app()->hasDebugModeEnabled() && in_array($status, [403, 404, 500, 503], true) && ! $request->expectsJson()) {
                return Inertia::render('Error', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            if ($status === 419) {
                return back()->with('error', 'Sua sessão expirou. Tente novamente.');
            }

            return $response;
        });
    })->create();

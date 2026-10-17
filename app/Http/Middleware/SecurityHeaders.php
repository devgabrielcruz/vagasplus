<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        // Câmera e microfone só para a própria página e para a sala de videochamada da Tavus (Daily) embutida em iframe.
        $response->headers->set('Permissions-Policy', 'camera=(self "https://tavus.daily.co"), microphone=(self "https://tavus.daily.co"), geolocation=()');

        // Páginas administrativas nunca devem ser indexadas nem guardadas em cache compartilhado.
        if ($request->is('admin', 'admin/*')) {
            $response->headers->set('X-Robots-Tag', 'noindex, nofollow');
            $response->headers->set('Cache-Control', 'no-store, private');
        }

        return $response;
    }
}

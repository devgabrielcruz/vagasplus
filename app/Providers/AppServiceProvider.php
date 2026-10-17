<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Cada chamada pode custar uma requisição ao Gemini: limite por minuto e por dia, por IP (vale para todos os recursos de IA).
        RateLimiter::for('ai-assistant', fn (Request $request) => [
            Limit::perMinute(10)->by($request->ip()),
            Limit::perDay(60)->by($request->ip()),
        ]);    }
}

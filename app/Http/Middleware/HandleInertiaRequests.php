<?php

namespace App\Http\Middleware;

use App\Services\Settings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'app' => [
                'name' => config('app.name'),
                'url' => config('app.url'),
                'contactEmail' => fn () => app(Settings::class)->get('contact_email'),
            ],
            'ads' => fn () => app(Settings::class)->ads(),
            'auth' => [
                'user' => fn () => $request->user()?->is_admin
                    ? ['name' => $request->user()->name, 'email' => $request->user()->email]
                    : null,
            ],
            // Conta logada (candidato ou equipe) para o cabeçalho do site público.
            'account' => fn () => ($u = $request->user()) ? ['name' => $u->name, 'email' => $u->email, 'is_admin' => (bool) $u->is_admin] : null,
            'pendingSubmissions' => fn () => $request->user()?->is_admin ? \App\Models\JobSubmission::where('status', 'pending')->count() : 0,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}

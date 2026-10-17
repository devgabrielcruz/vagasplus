<?php

namespace App\Http\Controllers\Public;

use App\Support\Seo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** "Minha conta" do candidato. Ponto de partida para planos, créditos e pagamentos (ainda não existem). */
class AccountController extends PublicController
{
    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Public/Account', [
            'member' => ['name' => $user->name, 'email' => $user->email, 'since' => $user->created_at?->translatedFormat('F \d\e Y')],
            'seo' => Seo::make('Minha conta', 'Gerencie sua conta no VagasPlus.', route('account'), index: false),
        ]);
    }
}

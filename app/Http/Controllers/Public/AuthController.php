<?php

namespace App\Http\Controllers\Public;

use App\Models\User;
use App\Support\Seo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/** Conta do candidato: cadastro, entrada e saída. (O acesso da equipe continua em /admin/login.) */
class AuthController extends PublicController
{
    public function showRegister(): Response
    {
        return Inertia::render('Public/Auth/Register', [
            'seo' => Seo::make('Criar conta', 'Crie sua conta gratuita no VagasPlus.', route('register'), index: false),
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $request->merge(['email' => Str::lower(trim((string) $request->input('email')))]);

        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers(), 'max:100'],
            'accepted' => ['accepted'],
        ], [
            'name.required' => 'Informe seu nome.',
            'email.required' => 'Informe seu e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'email.unique' => 'Este e-mail já está cadastrado. Tente entrar.',
            'password.required' => 'Crie uma senha.',
            'password.min' => 'A senha deve ter pelo menos 8 caracteres.',
            'password.letters' => 'A senha deve ter pelo menos uma letra.',
            'password.numbers' => 'A senha deve ter pelo menos um número.',
            'accepted.accepted' => 'Para criar a conta, aceite os Termos de uso e a Política de privacidade.',
        ]);

        // is_admin nunca vem do formulário: o cadastro público só cria candidatos.
        $user = User::create(['name' => trim($data['name']), 'email' => $data['email'], 'password' => $data['password']]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('account'))->with('success', 'Conta criada! Bem-vindo(a) ao VagasPlus.');
    }

    public function showLogin(): Response
    {
        return Inertia::render('Public/Auth/Login', [
            'seo' => Seo::make('Entrar', 'Entre na sua conta do VagasPlus.', route('login'), index: false),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], ['email.required' => 'Informe seu e-mail.', 'email.email' => 'Informe um e-mail válido.', 'password.required' => 'Informe sua senha.']);

        $throttleKey = 'login|'.Str::lower($credentials['email']).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            throw ValidationException::withMessages(['email' => 'Muitas tentativas. Tente novamente em '.RateLimiter::availableIn($throttleKey).' segundos.']);
        }

        if (! Auth::attempt(['email' => Str::lower($credentials['email']), 'password' => $credentials['password']], $request->boolean('remember'))) {
            RateLimiter::hit($throttleKey, 60);

            throw ValidationException::withMessages(['email' => 'E-mail ou senha incorretos.']);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        return redirect()->intended($request->user()->is_admin ? route('admin.dashboard') : route('account'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Você saiu da sua conta.');
    }
}

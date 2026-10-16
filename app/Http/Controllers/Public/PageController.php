<?php

namespace App\Http\Controllers\Public;

use App\Services\Settings;
use App\Support\Seo;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends PublicController
{
    public function about(): Response
    {
        return $this->page('about', 'Sobre o VagasPlus', 'Conheça o VagasPlus: um portal para descobrir vagas e ir direto à candidatura.', route('about'));
    }

    public function privacy(): Response
    {
        return $this->page('privacy', 'Política de privacidade', 'Como o VagasPlus trata dados, cookies e publicidade.', route('privacy'));
    }

    public function terms(): Response
    {
        return $this->page('terms', 'Termos de uso', 'Condições de uso do portal VagasPlus.', route('terms'));
    }

    private function page(string $page, string $title, string $description, string $canonical): Response
    {
        return Inertia::render('Public/Page', [
            'page' => $page,
            'title' => $title,
            'contactEmail' => app(Settings::class)->get('contact_email'),
            'seo' => Seo::make($title, $description, $canonical),
        ]);
    }
}

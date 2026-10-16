<?php

namespace Database\Seeders;

use App\Models\Platform;
use Illuminate\Database\Seeder;

class PlatformSeeder extends Seeder
{
    public function run(): void
    {
        $platforms = [
            ['Gupy', 'gupy', '#1f7a6d'], ['LinkedIn', 'linkedin', '#0a66c2'], ['Indeed', 'indeed', '#2557a7'],
            ['Sólides', 'solides', '#e0457b'], ['InHire', 'inhire', '#6c47ff'], ['Vagas.com', 'vagas_com', '#e8590c'],
            ['Catho', 'catho', '#d9480f'], ['InfoJobs', 'infojobs', '#0b7285'], ['Site da empresa', 'company_site', '#0b1f4d'],
            ['E-mail', 'email', '#475569', true], ['Outra plataforma', 'other', '#64748b'],
        ];

        foreach ($platforms as $i => $p) {
            // Logos de demonstração (fictícias) em public/img/platforms. Troque pelo upload oficial no painel.
            Platform::firstOrCreate(['slug' => $p[1]], [
                'name' => $p[0],
                'color' => $p[2],
                'uses_email' => $p[3] ?? false,
                'logo_url' => "/img/platforms/{$p[1]}.svg",
                'position' => $i,
                'is_active' => true,
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\JobStatus;
use App\Enums\SalaryPeriod;
use App\Enums\WorkMode;
use App\Models\Category;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Location;
use App\Models\Platform;
use App\Services\SlugGenerator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Vagas FICTÍCIAS apenas para desenvolvimento/demonstração local.
 * Uso: php artisan db:seed --class=DemoJobsSeeder   (recusa rodar em produção)
 */
class DemoJobsSeeder extends Seeder
{
    public function run(SlugGenerator $slugs): void
    {
        if (app()->isProduction()) {
            $this->command?->error('DemoJobsSeeder não pode rodar em produção.');

            return;
        }

        $this->call([CategorySeeder::class, PlatformSeeder::class]);

        $cat = fn (string $slug) => Category::where('slug', $slug)->firstOrFail()->id;
        $company = function (string $name) {
            $slug = Str::slug($name);

            // Logos fictícias (public/img/companies) apenas para demonstração.
            return Company::updateOrCreate(['slug' => $slug], ['name' => $name, 'logo_url' => asset("img/companies/{$slug}.svg")])->id;
        };
        $place = fn (string $city, string $uf) => Location::firstOrCreate(['city' => $city, 'state' => $uf], ['slug' => $slugs->location($city, $uf)])->id;

        $rows = [
            ['Analista de Suporte Técnico', 'Empresa Exemplo', 'atendimento-e-suporte', 'remote', null, 'clt', 'junior', [2800, 3600], 'Gupy', true, 2, 25],
            ['Desenvolvedor(a) Laravel Pleno', 'Exemplo Tech', 'tecnologia', 'hybrid', ['Curitiba', 'PR'], 'clt', 'mid', [8000, 11000], 'LinkedIn', true, 1, 28],
            ['Desenvolvedor(a) Vue.js Sênior', 'Exemplo Tech', 'tecnologia', 'remote', null, 'pj', 'senior', [14000, 18000], 'Site da empresa', true, 4, 20],
            ['Assistente Administrativo', 'Comércio Modelo', 'administrativo', 'onsite', ['São Paulo', 'SP'], 'clt', 'junior', null, 'Gupy', false, 5, 22],
            ['Estágio em Marketing Digital', 'Agência Modelo', 'marketing-e-comunicacao', 'hybrid', ['Belo Horizonte', 'MG'], 'internship', 'intern', [1800, 1800], 'Site da empresa', false, 0, 29],
            ['Analista Financeiro', 'Grupo Exemplo', 'financeiro-e-contabil', 'onsite', ['Porto Alegre', 'RS'], 'clt', 'mid', [5500, 7000], 'LinkedIn', false, 9, 18],
            ['Vendedor(a) Interno(a)', 'Loja Modelo', 'vendas', 'onsite', ['São Paulo', 'SP'], 'clt', null, null, 'Site da empresa', false, 3, 26],
            ['Designer de Produto', 'Estúdio Exemplo', 'design-e-criacao', 'remote', null, 'clt', 'mid', [7000, 9500], 'Gupy', false, 6, 24],
            ['Motorista Entregador', 'Logística Modelo', 'logistica-e-transporte', 'onsite', ['Curitiba', 'PR'], 'clt', null, [2600, 2600], 'Site da empresa', false, 7, 23],
            ['Enfermeiro(a) Plantonista', 'Clínica Exemplo', 'saude', 'onsite', ['Rio de Janeiro', 'RJ'], 'clt', 'mid', null, 'Site da empresa', false, 2, 27],
        ];

        $apply = 'https://exemplo.invalid/carreiras/';
        $platforms = ['gupy', 'linkedin', 'inhire', 'solides', 'indeed', 'company_site', 'email', 'gupy', 'vagas_com', 'catho'];

        foreach ($rows as $i => [$title, $companyName, $category, $mode, $loc, $type, $level, $salary, $source, $featured, $daysAgo, $daysLeft]) {
            $job = new JobPosting([
                'title' => $title,
                'slug' => $slugs->forJob($title, $companyName),
                'company_id' => $company($companyName),
                'category_id' => $cat($category),
                'location_id' => $loc ? $place(...$loc) : null,
                'work_mode' => WorkMode::from($mode),
                'employment_type' => EmploymentType::from($type),
                'experience_level' => $level ? ExperienceLevel::from($level) : null,
                'description' => "<p>Oportunidade de demonstração para <strong>{$title}</strong> na {$companyName}. Este texto é fictício e existe apenas para visualizar o layout.</p>",
                'responsibilities' => '<ul><li>Executar as atividades do dia a dia da área.</li><li>Colaborar com o time e registrar entregas.</li></ul>',
                'requirements' => '<ul><li>Experiência comprovada na função.</li><li>Boa comunicação.</li></ul>',
                'benefits' => $i % 2 === 0 ? '<ul><li>Vale-refeição</li><li>Plano de saúde</li></ul>' : null,
                'salary_min' => $salary[0] ?? null,
                'salary_max' => $salary[1] ?? null,
                'salary_period' => $salary ? SalaryPeriod::Month : null,
                'salary_currency' => 'BRL',
                'source_name' => $source,
                'platform_id' => Platform::where('slug', $platforms[$i % count($platforms)])->value('id'),
                'apply_url' => $i === 6 ? null : $apply.($i + 1),
                'apply_email' => $i === 6 ? 'rh@exemplo.invalid' : null,
                'is_featured' => $featured,
            ]);
            $job->forceFill([
                'status' => JobStatus::Published,
                'published_at' => now()->subDays($daysAgo),
                'expires_at' => now()->addDays($daysLeft),
            ])->save();
        }

        // Estados diversos para o painel
        JobPosting::factory()->draft()->create(['title' => 'Rascunho de demonstração']);
        JobPosting::factory()->scheduled()->create(['title' => 'Agendada de demonstração']);
        JobPosting::factory()->expired()->create(['title' => 'Expirada de demonstração']);
        JobPosting::factory()->archived()->create(['title' => 'Arquivada de demonstração']);
        JobPosting::factory()->create(['title' => 'Prestes a expirar (demonstração)', 'expires_at' => now()->addDays(2)]);
    }
}

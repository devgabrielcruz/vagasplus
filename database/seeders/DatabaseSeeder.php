<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Produção: apenas categorias iniciais. O administrador é criado com `php artisan admin:create`.
 * Vagas de demonstração: `php artisan db:seed --class=DemoJobsSeeder` (somente desenvolvimento).
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([CategorySeeder::class, PlatformSeeder::class]);
    }
}

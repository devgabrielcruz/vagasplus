<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['Tecnologia', 'code'], ['Atendimento e suporte', 'headset'], ['Vendas', 'shopping-cart'],
            ['Marketing e comunicação', 'megaphone'], ['Administrativo', 'briefcase'], ['Financeiro e contábil', 'landmark'],
            ['Saúde', 'heart-pulse'], ['Educação', 'graduation-cap'], ['Logística e transporte', 'truck'],
            ['Indústria e manutenção', 'factory'], ['Recursos humanos', 'users'], ['Jurídico', 'scale'],
            ['Design e criação', 'palette'], ['Alimentação e hotelaria', 'utensils'],
        ];

        foreach ($categories as $i => [$name, $icon]) {
            Category::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name, 'icon' => $icon, 'position' => $i, 'is_active' => true]);
        }
    }
}

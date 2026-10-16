<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryAndSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_manages_categories_with_unique_slugs(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/categorias', ['name' => 'Tecnologia', 'is_active' => true])->assertRedirect();
        $this->actingAs($admin)->post('/admin/categorias', ['name' => 'Tecnologia', 'is_active' => true])->assertRedirect();

        $this->assertSame(['tecnologia', 'tecnologia-2'], Category::orderBy('id')->pluck('slug')->all());

        $this->actingAs($admin)->post('/admin/categorias', ['name' => 'Outra', 'slug' => 'tecnologia'])->assertSessionHasErrors('slug');
    }

    public function test_category_with_jobs_cannot_be_deleted(): void
    {
        $admin = User::factory()->admin()->create();
        $job = JobPosting::factory()->create();

        $this->actingAs($admin)->delete("/admin/categorias/{$job->category_id}")->assertSessionHas('error');
        $this->assertDatabaseHas('categories', ['id' => $job->category_id]);
    }

    public function test_inactive_category_page_is_not_found(): void
    {
        $category = Category::factory()->create(['is_active' => false]);

        $this->get('/categorias/'.$category->slug)->assertNotFound();
    }

    public function test_settings_change_default_and_max_validity(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->put('/admin/configuracoes', [
            'default_validity_days' => 45, 'max_validity_days' => 30, 'contact_email' => 'a@b.com',
        ])->assertSessionHasErrors('max_validity_days');

        $this->actingAs($admin)->put('/admin/configuracoes', [
            'default_validity_days' => 15, 'max_validity_days' => 45, 'contact_email' => 'a@b.com',
        ])->assertSessionHasNoErrors();

        $this->assertSame(15, app(\App\Services\Settings::class)->get('default_validity_days'));
    }
}

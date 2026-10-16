<?php

namespace Tests\Feature\Admin;

use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_routes_require_authentication(): void
    {
        $job = JobPosting::factory()->draft()->create();

        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/vagas')->assertRedirect('/admin/login');
        $this->get('/admin/vagas/criar')->assertRedirect('/admin/login');
        $this->get("/admin/vagas/{$job->id}/editar")->assertRedirect('/admin/login');
        $this->get("/admin/vagas/{$job->id}/preview")->assertRedirect('/admin/login');
        $this->get('/admin/categorias')->assertRedirect('/admin/login');
        $this->get('/admin/configuracoes')->assertRedirect('/admin/login');
        $this->post("/admin/vagas/{$job->id}/arquivar")->assertRedirect('/admin/login');
        $this->post("/admin/vagas/{$job->id}/renovar")->assertRedirect('/admin/login');
        $this->post('/admin/vagas', [])->assertRedirect('/admin/login');
    }

    public function test_non_admin_users_are_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/admin')->assertForbidden();
        $this->actingAs($user)->get('/admin/vagas')->assertForbidden();
    }

    public function test_admin_can_access_dashboard_and_responses_are_not_indexable(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get('/admin')->assertOk()
            ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    public function test_there_is_no_public_registration(): void
    {
        $this->get('/register')->assertNotFound();
        $this->post('/register', ['name' => 'x', 'email' => 'x@x.com', 'password' => 'password123'])->assertStatus(404);
    }

    public function test_login_works_only_for_admins(): void
    {
        User::factory()->admin()->create(['email' => 'admin@example.com', 'password' => 'senha-segura-123']);
        User::factory()->create(['email' => 'user@example.com', 'password' => 'senha-segura-123']);

        $this->post('/admin/login', ['email' => 'user@example.com', 'password' => 'senha-segura-123'])
            ->assertSessionHasErrors('email');
        $this->assertGuest();

        $this->post('/admin/login', ['email' => 'admin@example.com', 'password' => 'senha-segura-123'])
            ->assertRedirect('/admin');
        $this->assertAuthenticated();
    }

    public function test_login_is_rate_limited(): void
    {
        User::factory()->admin()->create(['email' => 'admin@example.com', 'password' => 'senha-segura-123']);

        foreach (range(1, 5) as $i) {
            $this->post('/admin/login', ['email' => 'admin@example.com', 'password' => 'errada']);
        }

        $this->post('/admin/login', ['email' => 'admin@example.com', 'password' => 'senha-segura-123'])
            ->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_admin_create_command_makes_an_admin(): void
    {
        $this->artisan('admin:create', ['email' => 'novo@example.com', '--name' => 'Novo', '--password' => 'uma-senha-bem-longa'])
            ->assertSuccessful();

        $this->assertTrue(User::where('email', 'novo@example.com')->firstOrFail()->is_admin);

        $this->artisan('admin:create', ['email' => 'curta@example.com', '--name' => 'X', '--password' => 'curta'])
            ->assertFailed();
    }
}

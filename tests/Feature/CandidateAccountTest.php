<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CandidateAccountTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $over = []): array
    {
        return array_merge(['name' => 'Maria Souza', 'email' => 'Maria@Exemplo.com', 'password' => 'senha1234', 'accepted' => true], $over);
    }

    public function test_registers_a_candidate_and_logs_them_in(): void
    {
        $this->post('/cadastro', $this->payload())->assertRedirect('/conta');

        $user = User::where('email', 'maria@exemplo.com')->firstOrFail();
        $this->assertFalse($user->is_admin);
        $this->assertNotSame('senha1234', $user->password);
        $this->assertAuthenticatedAs($user);
    }

    public function test_public_registration_can_never_create_an_admin(): void
    {
        $this->post('/cadastro', $this->payload(['is_admin' => true, 'email' => 'x@exemplo.com']))->assertRedirect('/conta');

        $this->assertFalse(User::where('email', 'x@exemplo.com')->firstOrFail()->is_admin);
    }

    public function test_validates_the_registration(): void
    {
        User::factory()->create(['email' => 'maria@exemplo.com']);

        $this->post('/cadastro', [])->assertSessionHasErrors(['name', 'email', 'password', 'accepted']);
        $this->post('/cadastro', $this->payload(['password' => 'curta1']))->assertSessionHasErrors('password');
        $this->post('/cadastro', $this->payload(['password' => 'somenteletras']))->assertSessionHasErrors('password');
        $this->post('/cadastro', $this->payload(['accepted' => false]))->assertSessionHasErrors('accepted');
        $this->post('/cadastro', $this->payload())->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_logs_in_and_out(): void
    {
        $user = User::factory()->create(['email' => 'maria@exemplo.com', 'password' => 'senha1234']);

        $this->post('/entrar', ['email' => 'Maria@exemplo.com', 'password' => 'errada'])->assertSessionHasErrors('email');
        $this->assertGuest();

        $this->post('/entrar', ['email' => 'maria@exemplo.com', 'password' => 'senha1234'])->assertRedirect('/conta');
        $this->assertAuthenticatedAs($user);

        $this->post('/sair')->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_locks_out_after_repeated_failures(): void
    {
        User::factory()->create(['email' => 'maria@exemplo.com', 'password' => 'senha1234']);

        for ($i = 0; $i < 5; $i++) {
            $this->post('/entrar', ['email' => 'maria@exemplo.com', 'password' => 'errada']);
        }

        $this->post('/entrar', ['email' => 'maria@exemplo.com', 'password' => 'senha1234'])->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_account_page_requires_login_and_shows_the_member(): void
    {
        $this->get('/conta')->assertRedirect('/entrar');

        $this->actingAs(User::factory()->create(['name' => 'Maria Souza']))
            ->get('/conta')
            ->assertOk()
            ->assertInertia(fn (Assert $p) => $p->component('Public/Account')->where('member.name', 'Maria Souza')->where('account.name', 'Maria Souza'));
    }

    public function test_logged_in_users_skip_the_auth_pages(): void
    {
        $this->actingAs(User::factory()->create())->get('/entrar')->assertRedirect('/conta');
        $this->actingAs(User::factory()->admin()->create())->get('/cadastro')->assertRedirect('/admin');
    }

    public function test_candidates_cannot_reach_the_admin_panel(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();
    }

    public function test_candidates_cannot_use_the_admin_login(): void
    {
        User::factory()->create(['email' => 'maria@exemplo.com', 'password' => 'senha1234']);

        $this->post('/admin/login', ['email' => 'maria@exemplo.com', 'password' => 'senha1234'])->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_visitor_job_submission_is_disabled_by_default(): void
    {
        $this->get('/publicar-vaga')->assertNotFound();
        $this->post('/publicar-vaga', [])->assertNotFound();
        $this->get('/sitemap.xml')->assertDontSee('publicar-vaga');
    }

    public function test_header_offers_login_and_signup_instead_of_publishing(): void
    {
        $this->get('/')->assertOk()->assertDontSee('/publicar-vaga');
    }
}

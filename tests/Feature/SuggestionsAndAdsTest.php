<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Location;
use App\Models\User;
use App\Services\Settings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SuggestionsAndAdsTest extends TestCase
{
    use RefreshDatabase;

    public function test_suggestions_come_only_from_open_jobs(): void
    {
        $company = Company::factory()->create(['name' => 'Acme Soluções']);
        JobPosting::factory()->create(['title' => 'Analista de Dados', 'company_id' => $company->id]);
        JobPosting::factory()->expired()->create(['title' => 'Analista Secreto Expirado']);
        JobPosting::factory()->draft()->create(['title' => 'Analista Rascunho']);
        JobPosting::factory()->create(['title' => 'Designer']);

        $items = $this->getJson('/sugestoes?field=q&term=anali')->assertOk()->json('items');
        $labels = collect($items)->pluck('label')->all();

        $this->assertSame(['Analista de Dados'], $labels);

        $groups = collect($this->getJson('/sugestoes?field=q&term=acme')->json('items'))->pluck('group', 'label');
        $this->assertSame('Empresas', $groups['Acme Soluções']);
    }

    public function test_company_without_open_jobs_is_not_suggested(): void
    {
        Company::factory()->create(['name' => 'Fantasma Corp']);
        JobPosting::factory()->expired()->create(['company_id' => Company::first()->id]);

        $this->getJson('/sugestoes?term=fantasma')->assertJsonCount(0, 'items');
    }

    public function test_location_suggestions_and_short_terms(): void
    {
        $loc = Location::factory()->create(['city' => 'Curitiba', 'state' => 'PR']);
        JobPosting::factory()->count(2)->create(['location_id' => $loc->id]);
        Location::factory()->create(['city' => 'Campinas', 'state' => 'SP']);

        $this->getJson('/sugestoes?field=local&term=curi')->assertJsonPath('items.0.label', 'Curitiba, PR')->assertJsonPath('items.0.hint', '2 vagas');
        $this->getJson('/sugestoes?field=local&term=camp')->assertJsonCount(0, 'items');
        $this->getJson('/sugestoes?field=local&term=PR')->assertJsonCount(1, 'items');
        $this->getJson('/sugestoes?term=a')->assertJsonCount(0, 'items');
    }

    public function test_suggestion_search_treats_wildcards_literally(): void
    {
        JobPosting::factory()->create(['title' => 'Analista']);

        $this->getJson('/sugestoes?term=%25%25')->assertJsonCount(0, 'items');
    }

    public function test_category_suggestions_hide_empty_categories(): void
    {
        $with = Category::factory()->create(['name' => 'Tecnologia']);
        Category::factory()->create(['name' => 'Tecelagem']);
        JobPosting::factory()->create(['category_id' => $with->id]);

        $labels = collect($this->getJson('/sugestoes?term=tec')->json('items'))->pluck('label')->all();
        $this->assertSame(['Tecnologia'], $labels);
    }

    public function test_adsense_settings_are_validated_and_saved(): void
    {
        $admin = User::factory()->admin()->create();
        $base = ['default_validity_days' => 30, 'max_validity_days' => 90, 'contact_email' => 'a@b.com'];

        $this->actingAs($admin)->put('/admin/configuracoes', $base + ['adsense_enabled' => true, 'adsense_client' => ''])
            ->assertSessionHasErrors('adsense_client');
        $this->actingAs($admin)->put('/admin/configuracoes', $base + ['adsense_client' => 'pub-123'])
            ->assertSessionHasErrors('adsense_client');
        $this->actingAs($admin)->put('/admin/configuracoes', $base + ['adsense_client' => 'ca-pub-1234567890123456', 'adsense_slots' => ['home-top' => 'abc']])
            ->assertSessionHasErrors('adsense_slots.home-top');

        $this->actingAs($admin)->put('/admin/configuracoes', $base + [
            'adsense_enabled' => true, 'adsense_client' => 'ca-pub-1234567890123456',
            'adsense_slots' => ['home-top' => '1112223334', 'job-side' => '5556667778', 'desconhecida' => '999999'],
        ])->assertSessionHasNoErrors();

        $ads = app(Settings::class)->ads();
        $this->assertTrue($ads['enabled']);
        $this->assertSame('ca-pub-1234567890123456', $ads['client']);
        $this->assertSame(['home-top' => '1112223334', 'job-side' => '5556667778'], $ads['slots']);

        $this->get('/')->assertInertia(fn (Assert $p) => $p->where('ads.client', 'ca-pub-1234567890123456')->where('ads.slots.home-top', '1112223334'));
        $this->get('/ads.txt')->assertOk()->assertSee('google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0', false);
    }

    public function test_ads_txt_is_404_without_adsense_client(): void
    {
        $this->get('/ads.txt')->assertNotFound();
    }
}
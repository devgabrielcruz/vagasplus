<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 190)->unique();

            $table->string('title', 180);
            $table->foreignId('company_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();

            $table->string('work_mode', 20);
            $table->string('employment_type', 20);
            $table->string('experience_level', 20)->nullable();

            // Conteúdo (HTML sanitizado)
            $table->longText('description');
            $table->longText('responsibilities')->nullable();
            $table->longText('requirements')->nullable();
            $table->longText('nice_to_have')->nullable();
            $table->longText('benefits')->nullable();
            $table->longText('additional_info')->nullable();

            // Remuneração (somente quando divulgada)
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->char('salary_currency', 3)->default('BRL');
            $table->string('salary_period', 10)->nullable();

            // Origem e candidatura
            $table->string('source_name', 120)->nullable();
            $table->string('source_url', 1000)->nullable();
            $table->foreignId('platform_id')->constrained()->restrictOnDelete(); // canal de candidatura
            $table->string('apply_url', 1000)->nullable();       // vazio quando a candidatura é só por e-mail
            $table->string('apply_email', 190)->nullable();

            // Ciclo de vida
            $table->string('status', 20)->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->boolean('needs_review')->default(false);
            $table->timestamp('source_published_at')->nullable(); // data original na fonte
            $table->timestamp('published_at')->nullable();        // data de publicação no VagasPlus
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('expired_at')->nullable();          // quando o sistema encerrou a vaga
            $table->timestamp('archived_at')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Índices usados pelo filtro de vagas ativas e pelas listagens públicas
            $table->index(['status', 'published_at', 'expires_at'], 'job_postings_active_idx');
            $table->index(['category_id', 'status']);
            $table->index(['location_id', 'status']);
            $table->index(['work_mode', 'status']);
            $table->index('expires_at');
            $table->index(['platform_id', 'status']);
        });

        Schema::create('job_posting_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event', 40);
            $table->string('from_status', 20)->nullable();
            $table->string('to_status', 20)->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['job_posting_id', 'created_at']);
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key', 80)->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('job_posting_events');
        Schema::dropIfExists('job_postings');
    }
};

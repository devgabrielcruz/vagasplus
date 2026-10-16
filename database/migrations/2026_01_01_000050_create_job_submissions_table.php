<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('status', 20)->default('pending'); // pending | approved | rejected

            // Quem enviou
            $table->string('submitter_name', 120);
            $table->string('submitter_email', 190);
            $table->string('submitter_phone', 30)->nullable();
            $table->string('submitter_ip', 45)->nullable();

            // Empresa
            $table->string('company_name', 160);
            $table->string('company_website_url', 500)->nullable();
            $table->string('company_logo_path', 255)->nullable(); // upload (disco "public")

            // Vaga
            $table->string('title', 180);
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('work_mode', 20);
            $table->string('employment_type', 20);
            $table->string('experience_level', 20)->nullable();
            $table->string('city', 120)->nullable();
            $table->char('state', 2)->nullable();
            $table->longText('description');
            $table->longText('requirements')->nullable();
            $table->longText('benefits')->nullable();
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->string('salary_period', 10)->nullable();

            // Candidatura
            $table->foreignId('platform_id')->constrained()->restrictOnDelete();
            $table->string('apply_url', 1000)->nullable();
            $table->string('apply_email', 190)->nullable();

            // Análise
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('job_posting_id')->nullable()->constrained('job_postings')->nullOnDelete();

            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('submitter_email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_submissions');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('platforms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 80);
            $table->string('slug', 90)->unique();
            $table->char('color', 7)->default('#64748b');
            $table->string('logo_url', 500)->nullable();   // URL externa ou caminho local (/img/...)
            $table->string('logo_path', 255)->nullable();  // upload (disco "public")
            $table->boolean('uses_email')->default(false); // candidatura por e-mail, sem link
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('platforms');
    }
};

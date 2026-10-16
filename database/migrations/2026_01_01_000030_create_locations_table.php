<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('city', 120);
            $table->char('state', 2);
            $table->string('slug', 140)->unique();
            $table->timestamps();

            $table->unique(['city', 'state']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};

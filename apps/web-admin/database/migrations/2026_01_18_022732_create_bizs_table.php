<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bizs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('hero_image')->nullable();
            $table->enum('type', ['service', 'product', 'both'])->default('service');
            $table->string('industry')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('map_link')->nullable();
            $table->string('domain')->nullable();
            $table->string('subdomain')->nullable();
            $table->boolean('services_enabled')->default(false);
            $table->boolean('products_enabled')->default(false);
            $table->boolean('booking_enabled')->default(false);
            $table->boolean('ordering_enabled')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bizs');
    }
};

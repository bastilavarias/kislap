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
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('logo_image_url')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->enum('type', ['service', 'product', 'both'])->default('service');
            $table->string('industry')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('address')->nullable();
            $table->string('instagram')->nullable();
            $table->string('map_link')->nullable();
            $table->string('domain')->nullable();
            $table->string('subdomain')->nullable();
            $table->boolean('services_enabled')->default(false);
            $table->boolean('products_enabled')->default(false);
            $table->boolean('booking_enabled')->default(false);
            $table->boolean('ordering_enabled')->default(false);
            $table->string('theme_name')->nullable();
            $table->json('theme_object')->nullable();
            $table->string('layout_name')->default('default');
            $table->softDeletes();

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

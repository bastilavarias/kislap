<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id')->index();
            $table->unsignedBigInteger('user_id')->index();

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('website_url')->nullable();
            $table->string('whatsapp')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->text('google_maps_url')->nullable();
            $table->string('currency', 10)->default('PHP');

            $table->string('layout_name')->default('menu-default');
            $table->string('theme_name')->nullable()->default('default');
            $table->json('theme_object')->nullable();
            $table->json('qr_settings')->nullable();
            $table->boolean('search_enabled')->default(true);
            $table->boolean('hours_enabled')->default(false);
            $table->json('business_hours')->nullable();
            $table->json('social_links')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};

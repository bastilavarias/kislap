<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('linktree_sections', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('linktree_id')->index();

            $table->integer('placement_order')->default(0);
            $table->string('type')->default('promo');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->text('url')->nullable();
            $table->text('app_url')->nullable();
            $table->string('image_url')->nullable();
            $table->string('icon_key')->nullable();
            $table->string('accent_color')->nullable();
            $table->text('quote_text')->nullable();
            $table->string('quote_author')->nullable();
            $table->text('banner_text')->nullable();
            $table->text('support_note')->nullable();
            $table->string('support_qr_image_url')->nullable();
            $table->string('cta_label')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('linktree_id')->references('id')->on('linktrees')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('linktree_sections');
    }
};


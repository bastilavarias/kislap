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
        Schema::create('biz_gallery', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('biz_id')->index();
            $table->string('image_url')->nullable();
            $table->integer('placement_order')->default(0);

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('biz_id')->references('id')->on('bizs')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biz_gallery');
    }
};

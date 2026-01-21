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
        Schema::create('biz_social_links', function (Blueprint $table) {
            $table->id();
            $table->integer('placement_order')->default(0);
            $table->unsignedBigInteger('biz_id');
            $table->string('platform');
            $table->string('url');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('biz_id')->references('id')->on('bizs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biz_social_links');
    }
};

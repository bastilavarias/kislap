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
        Schema::create('linktree_links', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('linktree_id')->index();

            $table->integer('placement_order')->default(0);

            $table->string('title')->nullable();
            $table->string('url')->nullable();
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('linktree_id')->references('id')->on('linktrees')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linktree_links');
    }
};

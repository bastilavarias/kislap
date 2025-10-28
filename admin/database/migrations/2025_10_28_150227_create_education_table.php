<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('portfolio_id')
                ->nullable()
                ->constrained('portfolios')
                ->nullOnDelete();
            $table->string('school');
            $table->string('level');
            $table->string('degree')->nullable();
            $table->string('location')->nullable();
            $table->string('year_start')->nullable();
            $table->string('year_end')->nullable();
            $table->text('about')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education');
    }
};

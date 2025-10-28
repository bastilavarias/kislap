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
        Schema::create('showcase_technologies', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('portfolio_id')
                ->nullable()
                ->constrained('portfolios')
                ->nullOnDelete();
            $table->foreignId('showcase_id')->nullable()->constrained('showcases')->nullOnDelete();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('showcase_technologies');
    }
};

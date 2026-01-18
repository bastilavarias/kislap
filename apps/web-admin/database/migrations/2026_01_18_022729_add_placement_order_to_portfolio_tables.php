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
        Schema::table('work_experiences', function (Blueprint $table) {
            $table->integer('placement_order')->default(0)->after('id');
        });

        Schema::table('education', function (Blueprint $table) {
            $table->integer('placement_order')->default(0)->after('id');
        });

        Schema::table('showcases', function (Blueprint $table) {
            $table->integer('placement_order')->default(0)->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_experiences', function (Blueprint $table) {
            $table->dropColumn('placement_order');
        });

        Schema::table('education', function (Blueprint $table) {
            $table->dropColumn('placement_order');
        });

        Schema::table('showcases', function (Blueprint $table) {
            $table->dropColumn('placement_order');
        });
    }
};

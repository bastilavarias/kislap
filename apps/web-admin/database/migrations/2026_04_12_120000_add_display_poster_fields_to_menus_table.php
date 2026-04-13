<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menus', function (Blueprint $table): void {
            $table->json('display_poster_settings')->nullable()->after('qr_settings');
            $table->string('display_poster_image_url')->nullable()->after('display_poster_settings');
        });
    }

    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table): void {
            $table->dropColumn(['display_poster_settings', 'display_poster_image_url']);
        });
    }
};

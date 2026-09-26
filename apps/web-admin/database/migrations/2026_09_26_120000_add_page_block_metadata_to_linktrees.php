<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('linktrees', function (Blueprint $table) {
            $table->string('composition_layout')->default('classic')->after('layout_name');
        });

        Schema::table('linktree_links', function (Blueprint $table) {
            $table->json('content_json')->nullable()->after('cta_label');
            $table->json('layout_json')->nullable()->after('content_json');
            $table->json('style_json')->nullable()->after('layout_json');
        });
    }

    public function down(): void
    {
        Schema::table('linktree_links', function (Blueprint $table) {
            $table->dropColumn(['content_json', 'layout_json', 'style_json']);
        });

        Schema::table('linktrees', function (Blueprint $table) {
            $table->dropColumn('composition_layout');
        });
    }
};

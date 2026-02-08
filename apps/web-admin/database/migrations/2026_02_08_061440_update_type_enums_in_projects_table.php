<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE projects MODIFY COLUMN type ENUM('portfolio', 'biz', 'links', 'waitlist', 'linktree') NOT NULL DEFAULT 'portfolio'");

        DB::table('projects')
            ->where('type', 'links')
            ->update(['type' => 'linktree']);

        DB::statement("ALTER TABLE projects MODIFY COLUMN type ENUM('portfolio', 'biz', 'waitlist', 'linktree') NOT NULL DEFAULT 'portfolio'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE projects MODIFY COLUMN type ENUM('portfolio', 'biz', 'waitlist', 'linktree', 'links') NOT NULL DEFAULT 'portfolio'");

        DB::table('projects')
            ->where('type', 'linktree')
            ->update(['type' => 'links']);

        DB::statement("ALTER TABLE projects MODIFY COLUMN type ENUM('portfolio', 'biz', 'links', 'waitlist') NOT NULL DEFAULT 'portfolio'");
    }
};

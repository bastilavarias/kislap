<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('linktree_links')) {
            DB::statement('ALTER TABLE `linktree_links` MODIFY COLUMN `accent_color` TEXT NULL');
        }

        if (Schema::hasTable('linktree_sections')) {
            DB::statement('ALTER TABLE `linktree_sections` MODIFY COLUMN `accent_color` TEXT NULL');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('linktree_links')) {
            DB::statement('ALTER TABLE `linktree_links` MODIFY COLUMN `accent_color` VARCHAR(50) NULL');
        }

        if (Schema::hasTable('linktree_sections')) {
            DB::statement('ALTER TABLE `linktree_sections` MODIFY COLUMN `accent_color` VARCHAR(50) NULL');
        }
    }
};

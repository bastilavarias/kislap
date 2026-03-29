<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE projects MODIFY COLUMN type ENUM('portfolio', 'biz', 'waitlist', 'linktree', 'menu') NOT NULL DEFAULT 'portfolio'");
        DB::statement("ALTER TABLE layouts MODIFY COLUMN type ENUM('portfolio', 'biz', 'links', 'waitlist', 'menu') NOT NULL DEFAULT 'portfolio'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE projects MODIFY COLUMN type ENUM('portfolio', 'biz', 'waitlist', 'linktree') NOT NULL DEFAULT 'portfolio'");
        DB::statement("ALTER TABLE layouts MODIFY COLUMN type ENUM('portfolio', 'biz', 'links', 'waitlist') NOT NULL DEFAULT 'portfolio'");
    }
};

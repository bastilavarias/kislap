<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_banned')->default(false)->after('role');
            $table->timestamp('banned_at')->nullable()->after('is_banned');
            $table->text('ban_reason')->nullable()->after('banned_at');
            $table->unsignedBigInteger('banned_by')->nullable()->after('ban_reason');

            $table->foreign('banned_by')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['banned_by']);
            $table->dropColumn(['is_banned', 'banned_at', 'ban_reason', 'banned_by']);
        });
    }
};

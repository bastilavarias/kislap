<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('showcases', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('role');
            $table->boolean('is_approved')->default(false)->after('is_featured');
            $table->timestamp('approved_at')->nullable()->after('is_approved');
            $table->unsignedBigInteger('approved_by')->nullable()->after('approved_at');

            $table->foreign('approved_by')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('showcases', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['is_featured', 'is_approved', 'approved_at', 'approved_by']);
        });
    }
};

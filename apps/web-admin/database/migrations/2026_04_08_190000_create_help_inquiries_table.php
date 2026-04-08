<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('help_inquiries', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->string('name');
            $table->string('email');
            $table->string('mobile_number')->nullable();
            $table->text('description');
            $table->string('source_page')->nullable();
            $table->string('status')->default('new')->index();
            $table->text('admin_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->string('ip_address', 45)->index();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('help_inquiries');
    }
};

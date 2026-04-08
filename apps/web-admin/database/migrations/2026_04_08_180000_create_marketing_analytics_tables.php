<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_key')->unique();
            $table->string('visitor_key')->nullable()->index();
            $table->string('entry_page');
            $table->string('exit_page')->nullable();
            $table->string('referrer')->nullable();
            $table->string('source_label')->default('Direct')->index();
            $table->string('utm_source')->nullable()->index();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('device_type')->nullable();
            $table->string('browser')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->boolean('is_bounced')->default(true);
            $table->timestamp('started_at')->nullable()->index();
            $table->timestamp('last_seen_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('marketing_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('marketing_session_id')->constrained('marketing_sessions')->cascadeOnDelete();
            $table->string('event_type')->index();
            $table->string('event_name')->index();
            $table->string('page_path')->index();
            $table->string('target_url')->nullable();
            $table->string('element_key')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_events');
        Schema::dropIfExists('marketing_sessions');
    }
};

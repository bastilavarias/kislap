<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('linktree_links', function (Blueprint $table) {
            $table->string('type')->default('link')->after('placement_order');
            $table->text('app_url')->nullable()->after('url');
            $table->string('icon_key')->nullable()->after('image_url');
            $table->string('accent_color')->nullable()->after('icon_key');
            $table->text('quote_text')->nullable()->after('accent_color');
            $table->string('quote_author')->nullable()->after('quote_text');
            $table->text('banner_text')->nullable()->after('quote_author');
            $table->text('support_note')->nullable()->after('banner_text');
            $table->string('support_qr_image_url')->nullable()->after('support_note');
            $table->string('cta_label')->nullable()->after('support_qr_image_url');
        });

        DB::statement("
            INSERT INTO linktree_links (
                linktree_id,
                placement_order,
                type,
                title,
                url,
                app_url,
                image_url,
                description,
                icon_key,
                accent_color,
                quote_text,
                quote_author,
                banner_text,
                support_note,
                support_qr_image_url,
                cta_label,
                created_at,
                updated_at,
                deleted_at
            )
            SELECT
                linktree_id,
                placement_order,
                type,
                title,
                url,
                app_url,
                image_url,
                description,
                icon_key,
                accent_color,
                quote_text,
                quote_author,
                banner_text,
                support_note,
                support_qr_image_url,
                cta_label,
                created_at,
                updated_at,
                deleted_at
            FROM linktree_sections
        ");
    }

    public function down(): void
    {
        Schema::table('linktree_links', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'app_url',
                'icon_key',
                'accent_color',
                'quote_text',
                'quote_author',
                'banner_text',
                'support_note',
                'support_qr_image_url',
                'cta_label',
            ]);
        });
    }
};

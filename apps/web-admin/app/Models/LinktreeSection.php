<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LinktreeSection extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'linktree_id',
        'placement_order',
        'type',
        'title',
        'description',
        'url',
        'app_url',
        'image_url',
        'icon_key',
        'accent_color',
        'quote_text',
        'quote_author',
        'banner_text',
        'support_note',
        'support_qr_image_url',
        'cta_label',
    ];

    public function linktree(): BelongsTo
    {
        return $this->belongsTo(Linktree::class);
    }
}

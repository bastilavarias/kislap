<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LinktreeLink extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'linktree_id',
        'placement_order',
        'title',
        'url',
        'image_url',
        'description',
    ];

    public function linktree(): BelongsTo
    {
        return $this->belongsTo(Linktree::class);
    }
}

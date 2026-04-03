<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShowcaseTechnology extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'portfolio_id',
        'showcase_id',
        'name',
    ];

    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function showcase(): BelongsTo
    {
        return $this->belongsTo(Showcase::class);
    }
}

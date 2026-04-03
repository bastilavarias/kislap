<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'type',
        'page_url',
        'ip_address',
        'model_id',
        'model_name',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}

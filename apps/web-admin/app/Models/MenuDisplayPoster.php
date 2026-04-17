<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuDisplayPoster extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'project_id',
        'image_url',
        'settings',
        'is_deleted',
        'deleted_at',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
            'is_deleted' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}

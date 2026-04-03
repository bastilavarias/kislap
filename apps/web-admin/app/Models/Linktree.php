<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Linktree extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'user_id',
        'name',
        'tagline',
        'about',
        'logo_url',
        'layout_name',
        'theme_name',
        'theme_object',
        'phone',
        'email',
        'background_style',
    ];

    protected function casts(): array
    {
        return [
            'theme_object' => 'array',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(LinktreeSection::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(LinktreeLink::class);
    }
}

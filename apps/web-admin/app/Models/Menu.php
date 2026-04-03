<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'user_id',
        'name',
        'description',
        'logo_url',
        'cover_image_url',
        'phone',
        'email',
        'website_url',
        'whatsapp',
        'address',
        'city',
        'country',
        'google_maps_url',
        'currency',
        'layout_name',
        'theme_name',
        'theme_object',
        'qr_settings',
        'search_enabled',
        'hours_enabled',
        'business_hours',
        'social_links',
        'gallery_images',
    ];

    protected function casts(): array
    {
        return [
            'theme_object' => 'array',
            'qr_settings' => 'array',
            'business_hours' => 'array',
            'social_links' => 'array',
            'gallery_images' => 'array',
            'search_enabled' => 'boolean',
            'hours_enabled' => 'boolean',
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

    public function categories(): HasMany
    {
        return $this->hasMany(MenuCategory::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }
}

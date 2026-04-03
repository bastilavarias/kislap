<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Portfolio extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'user_id',
        'name',
        'job_title',
        'introduction',
        'location',
        'about',
        'email',
        'phone',
        'website',
        'github',
        'linkedin',
        'twitter',
        'theme_name',
        'theme_object',
        'layout_name',
        'avatar_url',
        'resume_url',
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

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function education(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    public function showcases(): HasMany
    {
        return $this->hasMany(Showcase::class);
    }

    public function showcaseTechnologies(): HasMany
    {
        return $this->hasMany(ShowcaseTechnology::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class);
    }
}

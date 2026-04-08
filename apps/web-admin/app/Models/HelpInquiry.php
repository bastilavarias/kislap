<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HelpInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'name',
        'email',
        'mobile_number',
        'description',
        'source_page',
        'status',
        'admin_notes',
        'resolved_at',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
        ];
    }
}

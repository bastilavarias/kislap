<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservedSubDomain extends Model
{
    use HasFactory;

    protected $table = 'reserved_sub_domains';

    protected $fillable = [
        'sub_domain',
        'type',
    ];
}

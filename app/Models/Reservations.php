<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Reservations extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'product_id',
        'reserved_quantity'
    ];
}

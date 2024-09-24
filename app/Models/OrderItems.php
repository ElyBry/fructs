<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OrderItems extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'total_price',
    ];

    public function getProduct($product_id)
    {
        return DB::table('products')
            ->where('id', $product_id)
            ->first();
    }
    public function getOrder($order_id)
    {
        return DB::table('orders')
            ->where('id', $order_id)
            ->first();
    }
}

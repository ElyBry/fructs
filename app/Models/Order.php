<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address',
        'total_price',
        'payment_method_id',
        'payment_status_id',
        'quantity',
        'picked_trade_point',
        'discount_percent',
        'cost_with_discount',
        'how_deliver',
        'how_connect',
        'how_social',
        'discount',
        'comment',
    ];


    public function getUser($user_id)
    {
        return DB::table("users")
            ->where("id", $user_id)
            ->first();
    }
    public function getProduct($product_id)
    {
        return DB::table("products")->where("id", $product_id)->first();
    }
}

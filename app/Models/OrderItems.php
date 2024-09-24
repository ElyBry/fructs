<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OrderItems extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'address',
        'product_id',
        'quantity',
        'total_price',
        'payment_method_id',
        'payment_status_id'
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class FeedbackProducts extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'user_name',
        'product_id',
        'message',
        'is_approved',
        'rating'
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

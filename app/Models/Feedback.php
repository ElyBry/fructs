<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Feedback extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'user_name',
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
}

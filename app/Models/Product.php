<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'price',
        'weight',
        'img',
        'type_products_id',
        'color_id',
        'country_id',
        'count',
    ];
    public function getCountry($countryId)
    {
        return DB::table("countries")
            ->where("id", $countryId)
            ->first();
    }
    public function getTypeProducts($typeProductsId)
    {
        return DB::table("type_products")
            ->where("id", $typeProductsId)
            ->first();
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typeProducts = [
            [
                'name' => 'Фрукты',
                'img' => 'image/types_for_products/frukti.webp'
            ],
            [
                'name' => 'Овощи',
                'img' => 'image/types_for_products/ovoshi.webp'
            ],
            [
                'name' => 'Ягоды',
                'img' => 'image/types_for_products/yagodi.webp'
            ],
            [
                'name' => 'Орехи',
                'img' => 'image/types_for_products/orexi.webp'
            ],
            [
                'name' => 'Сладости и десерты',
                'img' => 'image/types_for_products/sladost.webp'
            ]
        ];
        DB::table('type_products')->insert($typeProducts);
    }
}

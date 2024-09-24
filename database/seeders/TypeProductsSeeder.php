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
                'img' => 'image/types_for_products/frukti.png'
            ],
            [
                'name' => 'Овощи',
                'img' => 'image/types_for_products/ovoshi.png'
            ],
            [
                'name' => 'Ягоды',
                'img' => 'image/types_for_products/yagodi.png'
            ],
            [
                'name' => 'Орехи',
                'img' => 'image/types_for_products/orexi.png'
            ],
            [
                'name' => 'Сладости и десерты',
                'img' => 'image/types_for_products/sladost.png'
            ]
        ];
        DB::table('type_products')->insert($typeProducts);
    }
}

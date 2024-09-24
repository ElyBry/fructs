<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $products = [
            [
                'title' => 'Красное Яблоко',
                'description' => 'Сочное, сладкое и хрустящее фрукт.',
                'color_id' => 2,
                'type_products_id' => 3,
                'img' => 'image/fruits_for_products/redApple.png'
            ],
            [
                'title' => 'Банан',
                'description' => 'Мягкий и сладкий фрукт, идеально подходит для завтрака.',
                'color_id' => 3,
                'type_products_id' => 1,
                'img' => 'image/fruits_for_products/banana.png'
            ],
            [
                'title' => 'Морковь',
                'description' => 'Хрустящий овощ, богатый витаминами.',
                'color_id' => 5,
                'type_products_id' => 2,
                'img' => 'image/fruits_for_products/morkov.png'
            ],
            [
                'title' => 'Помидор',
                'description' => 'Сладкий овощ, который часто используется в салатах.',
                'color_id' => 2,
                'type_products_id' => 2,
                'img' => 'image/fruits_for_products/tomato.png'
            ],
            [
                'title' => 'Картофель',
                'description' => 'Универсальный овощ, используемый в различных блюдах.',
                'color_id' => 1,
                'type_products_id' => 2,
                'img' => 'image/fruits_for_products/potato.png'
            ],
            [
                'title' => 'Малина',
                'description' => 'Ну очень вкусная',
                'color_id' => 1,
                'type_products_id' => 3,
                'img' => 'image/fruits_for_products/malina.png'
            ]
        ];

        $arrUnits = ['Грамм', 'Килограмм'];
        $arrUnitsC = ['100','500','1000'];
        for ($i = 0; $i <= 50; $i++) {
            foreach ($products as $product) {
                Product::create([
                    'title' => $product['title'],
                    'description' => $product['description'],
                    'price' => rand(50, 500),
                    'img' => $product['img'],
                    'type_products_id' => $product['type_products_id'],
                    'color_id' => $product['color_id'],
                    'country_id' => rand(1, 50),
                    'count' => rand(0, 100),
                    'weight' => $arrUnitsC[array_rand($arrUnitsC)] ." ". $arrUnits[array_rand($arrUnits)],
                ]);
            }
        }
    }
}

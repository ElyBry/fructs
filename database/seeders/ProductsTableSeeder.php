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
        $faker = \Faker\Factory::create();
        $arrUnits = ['Грамм','Килограмм','Штуку'];
        // Create 50 product records
        for ($i = 0; $i < 50; $i++) {
            $countAvailable = $faker->numberBetween(0,100);
            shuffle($arrUnits);
            Product::create([
                'title' => $faker->word,
                'description' => $faker->paragraph,
                'price' => $faker->randomNumber(2),
                'availability' => $countAvailable > 0,
                'count' => $countAvailable,
                'weight' => $arrUnits[0]
            ]);
        }
    }
}

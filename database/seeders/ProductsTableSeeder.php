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
        for ($i = 0; $i < 50; $i++) {
            shuffle($arrUnits);
            Product::create([
                'title' => $faker->word,
                'description' => $faker->paragraph,
                'price' => $faker->randomNumber(2),
                'img' => $faker->imageUrl($width = 640, $height = 480),
                'country_id' => $faker->numberBetween(1,50),
                'count' => $faker->numberBetween(0,100),
                'weight' => $arrUnits[0]
            ]);
        }
    }
}

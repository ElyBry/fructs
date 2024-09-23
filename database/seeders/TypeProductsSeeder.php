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
            ['name' => 'Фрукты'],
            ['name' => 'Овощи'],
            ['name' => 'Ягоды'],
            ['name' => 'Орехи'],
            ['name' => 'Сладости и десерты']
        ];
        DB::table('type_products')->insert($typeProducts);
    }
}

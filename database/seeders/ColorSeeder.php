<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $color = [
            ['name' => 'Белый'],
            ['name' => 'Красный'],
            ['name' => 'Жёлтый'],
            ['name' => 'Зеленый'],
            ['name' => 'Оранжевый'],
            ['name' => 'Фиолетовый']
        ];
        DB::table('colors')->insert($color);
    }
}

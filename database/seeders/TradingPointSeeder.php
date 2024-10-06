<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TradingPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("trading_points")->insert([
            "name" => "Фруктовый рай",
            "address" => "Г. Екатеринбург, ул. 8 Марта 86а"
        ]);
    }
}

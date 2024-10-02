<?php

namespace Database\Seeders;

use App\Models\Promos;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PromoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            Promos::create([
                'name' => 'TestPromoAziz ' . $i,
                'discount' => rand(0, 100),
            ]);
        }
    }
}

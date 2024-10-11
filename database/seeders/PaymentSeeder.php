<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('payment_methods')->insert([
            ['name' => 'Наличная оплата'],
            ['name' => 'Безналичная оплата'],
            ['name' => 'Переводом'],
        ]);
        DB::table('order_statuses')->insert([
            ['name' => 'В ожидании'],
            ['name' => 'В обработке'],
            ['name' => 'Курьер в пути'],
            ['name' => 'Доставлено'],
            ['name' => 'Отменено'],
            ['name' => 'Возврат'],
            ['name' => 'На удержании']
        ]);
    }
}

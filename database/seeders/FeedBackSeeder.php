<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FeedBackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 100; $i++) {
            $feedBacks = [
                [
                    'user_id' => 0,
                    'user_name' => 'Тестовый пользователь',
                    'message' => 'Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва ',
                    'rating' => rand(1, 5),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ];
            DB::table('feedback')->insert($feedBacks);
        }
        // FeedbackProducts
        for ($i = 1; $i <= rand(1000, 5000); $i++) {
            $feedBacks = [
                [
                    'user_id' => 0,
                    'user_name' => 'Тестовый пользователь',
                    'message' => 'Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва Проверка отзыва ',
                    'rating' => rand(1, 5),
                    'product_id' => rand(1, 300),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ];
            DB::table('feedback_products')->insert($feedBacks);
        }
    }
}

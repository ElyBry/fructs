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
        DB::table('feedBacks')->insert($feedBacks);
    }
}

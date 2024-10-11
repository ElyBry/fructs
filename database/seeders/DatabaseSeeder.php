<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CountriesSeeder::class,
            PaymentSeeder::class,
            PermissionTableSeeder::class,
            ProductsTableSeeder::class,
            ColorSeeder::class,
            TypeProductsSeeder::class,
            FeedBackSeeder::class,
            OrderSeeder::class,
            PromoSeeder::class,
            TradingPointSeeder::class,
        ]);
        $superAdmin = User::factory()->create([
            'name' => 'Test User',
            'email' => 'ermakov631@gmail.com',
            'password' => Hash::make('1234512345'),
        ]);
        $superAdmin->assignRole('Super Admin');
        $admin = User::factory()->create([
            'name' => 'Азиз',
            'email' => 'aziz@aziz.com',
            'password' => Hash::make('AzizPassword'),
        ]);
        $admin->assignRole('Admin');
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => Hash::make('1234512345'),
        ]);
        $testUser->assignRole('User');
    }
}

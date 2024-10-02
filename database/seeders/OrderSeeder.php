<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItems;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            $userId = rand(1, 3);
            $address = $faker->address;
            $paymentMethodId = rand(1, 3);
            $paymentStatusId = rand(1, 8);

            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $userId,
                'address' => $address,
                'total_price' => 0,
                'payment_method_id' => $paymentMethodId,
                'payment_status_id' => $paymentStatusId,
                'created_at' => $faker->dateTimeBetween('-12 months', 'now'),
            ]);

            $totalPrice = 0;
            for ($l = 0; $l < rand(1, 5); $l++) {
                $productId = rand(1, 50);
                $quantity = rand(1, 3);
                $productPrice = Product::find($productId)->price;
                $itemTotalPrice = $productPrice * $quantity;

                DB::table('order_items')->insertGetId([
                   'order_id' => $orderId,
                   'product_id' => $productId,
                   'quantity' => $quantity,
                   'total_price' => $itemTotalPrice,
                ]);

                $totalPrice += $itemTotalPrice;
            }
            DB::table('orders')->where('id', $orderId)->update(['total_price' => $totalPrice]);
        }
    }
}

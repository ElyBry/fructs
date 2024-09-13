<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('adress');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('quantity');
            $table->unsignedBigInteger('total_price');
            $table->unsignedBigInteger('payment_method_id');
            $table->unsignedBigInteger('payment_status_id');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods');
            $table->foreign('payment_status_id')->references('id')->on('payment_statuses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

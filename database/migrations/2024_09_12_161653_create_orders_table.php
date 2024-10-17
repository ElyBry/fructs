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
            $table->string('address')->nullable();
            $table->string('number');
            $table->unsignedBigInteger('payment_method_id');
            $table->unsignedBigInteger('payment_status_id');
            $table->decimal('total_price', 10, 2);
            $table->string('how_deliver')->nullable();
            $table->string('how_connect')->nullable();
            $table->string('how_social')->nullable();
            $table->integer('quantity');
            $table->string('picked_trade_point')->nullable();
            $table->text('comment')->nullable();
            $table->decimal('discount_percent', 5, 2);
            $table->decimal('discount', 10, 2);
            $table->decimal('cost_with_discount', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

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
            $table->string('address');
            $table->unsignedBigInteger('payment_method_id');
            $table->unsignedBigInteger('payment_status_id');
            $table->decimal('total_price', 10, 2);
            $table->unsignedInteger('how_deliver')->nullable();
            $table->unsignedInteger('how_connect')->nullable();
            $table->unsignedInteger('how_social')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->string('picked_trade_point')->nullable();
            $table->text('comment')->nullable();
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('cost_with_discount', 10, 2)->default(0);
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

<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'api'
], function () {
    Route::get('products', [ProductsController::class, 'index']);
    Route::get('products/{product}', [ProductsController::class, 'show']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'api'
], function() {
    Route::post('products',[ProductsController::class, 'store']);
    Route::put('products/{product}',[ProductsController::class, 'update']);
    Route::delete('products/{product}', [ProductsController::class, 'delete']);
});

Route::post('api/auth/register', [AuthController::class, 'register'])->withoutMiddleware('auth:api');
Route::post('api/auth/login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
Route::group([
    'middleware' => 'auth:api',
    'prefix' => 'api/auth'
], function ($router) {
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/profile', [AuthController::class, 'profile']);
});

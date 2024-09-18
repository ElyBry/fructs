<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'api'
], function () {
    Route::get('products', [ProductsController::class, 'index']);
    Route::get('products/{product}', [ProductsController::class, 'show']);
});


Route::group([
    'middleware' => [
        'api',
        'permission:view-roles|edit-roles|create-roles|delete-roles'
    ],
    'prefix' => 'admin/'
], function () {
    Route::resource('/roles', RoleController::class);
    Route::resource('/users', UserController::class);
    Route::resource('/products', ProductsController::class);
});
Route::group([
    'middleware' => [
        'api',
        'permission:create-products|edit-products|delete-products',
    ],
    'prefix' => 'api/products'
], function() {
    Route::post('/',[ProductsController::class, 'store']);
    Route::put('{product}',[ProductsController::class, 'update']);
    Route::delete('{product}', [ProductsController::class, 'delete']);
});

Route::group([
    'prefix' => 'api/auth',
    ], function () {
    Route::post('register', [AuthController::class, 'register'])->withoutMiddleware('auth:api');
    Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
});

Route::group([
    'middleware' => 'auth:api',
    'prefix' => 'api/auth'
], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/profile', [AuthController::class, 'profile']);
});

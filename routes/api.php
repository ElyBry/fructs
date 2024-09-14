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
    'middleware' => ['auth']
], function () {
    //Route::resource('roles', 'App\Http\Controllers\RoleController'); #fix
    //Route::resource('users', 'App\Http\Controllers\UserController'); #fix
    //Route::resource('products', 'App\Http\Controllers\ProductsController'); #fix
});
Route::group([
    'middleware' => 'api',
    'prefix' => 'api/products'
], function() {
    Route::post('/',[ProductsController::class, 'store']);
    Route::put('{product}',[ProductsController::class, 'update']);
    Route::delete('{product}', [ProductsController::class, 'delete']);
});

Route::group(['prefix' => 'api/auth'], function () {
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

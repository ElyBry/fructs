<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FeedBackController;
use App\Http\Controllers\FeedBackProductsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TypeProductsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'api'
], function () {
    // Продукты
    Route::get('products', [ProductsController::class, 'index']);
    Route::get('popularProduct', [ProductsController::class, 'getMostPopularProduct']);
    Route::get('typeProducts', [ProductsController::class,'getAllTypeProducts']);
    Route::get('colors', [ProductsController::class,'getAllColors']);
    Route::get('countries', [ProductsController::class,'getCountry']);
    Route::get('newCategory', [ProductsController::class, 'getNewCategory']);
    Route::get('newProduct', [ProductsController::class, 'getNewProduct']);
    Route::get('products/{product}', [ProductsController::class, 'show']);
    Route::group([
        'middleware' => [
            'api',
            'permission:create-products|edit-products|delete-products',
        ],
        'prefix' => 'products'
    ], function () {
        Route::post('/',[ProductsController::class, 'store']);
        Route::put('{product}',[ProductsController::class, 'update']);
        Route::delete('{product}', [ProductsController::class, 'delete']);
    });
    Route::group([
        'middleware' => [
            'api',
            'permission:view-roles|edit-roles|create-roles|delete-roles'
        ],
        'prefix' => '/admin'
    ], function () {
        Route::resource('roles', RoleController::class);
        Route::resource('users', UserController::class);
        Route::resource('products', ProductsController::class);
        Route::resource('typeProducts', TypeProductsController::class);
        Route::resource('orders', OrderController::class);
        Route::resource('feedBacks', FeedBackController::class);
        Route::resource('feedBacksProducts', FeedBackProductsController::class);
    });
    Route::group([
        'prefix' => '/auth',
    ], function () {
        Route::post('register', [AuthController::class, 'register'])->withoutMiddleware('auth:api');
        Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
    });
    Route::group([
        'middleware' => 'api',
        'prefix' => '/auth'
    ], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/profile', [AuthController::class, 'profile']);
    });
});




<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ColorsController;
use App\Http\Controllers\CountriesController;
use App\Http\Controllers\FeedBackController;
use App\Http\Controllers\FeedBackProductsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TradingPointsController;
use App\Http\Controllers\TypeProductsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'api'
], function () {
    // Продукты
    Route::get('products', [ProductsController::class, 'index']);
    Route::get('popularProduct', [ProductsController::class, 'getMostPopularProduct']);
    Route::get('newProduct', [ProductsController::class, 'getNewProduct']);
    Route::get('productsOrderCount', [ProductsController::class, 'getProductOrderCount']);
    // Тип
    Route::get('typeProducts', [TypeProductsController::class,'getAllTypeProducts']);
    Route::get('newCategory', [TypeProductsController::class, 'getNewTypeProducts']);
    // Цвет
    Route::get('colors', [ColorsController::class,'index']);
    // Отзывы
    Route::get('feedBackProducts', [FeedBackProductsController::class,'getFeedBackProducts']);
    // Страны
    Route::get('countries', [CountriesController::class,'index']);
    // Корзина
    Route::get('updateCart', [ProductsController::class, 'updateCart']);
    // Промокоды
    Route::middleware('throttle:10,600')->group(function () {
        Route::get('promoVerify', [PromoController::class, 'verify']);
    });
    // Точки
    Route::get('tradingPoints', [TradingPointsController::class , 'index']);

    // Для менеджера/ администратора
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

    // Для администратора
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
        Route::resource('colors', ColorsController::class);
        Route::resource('countries', CountriesController::class);
        Route::resource('promo', PromoController::class);
        Route::resource('orders', OrderController::class);
        Route::resource('feedBacks', FeedBackController::class);
        Route::resource('feedBacksProducts', FeedBackProductsController::class);
    });
    // Вход и регистрация без аутентификации
    Route::group([
        'prefix' => '/auth',
    ], function () {
        Route::post('register', [AuthController::class, 'register'])->withoutMiddleware('auth:api')
            ->middleware('throttle:10,14400');
        Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
    });
    // При аутентификации
    Route::group([
        'middleware' => 'api',
        'prefix' => '/auth'
    ], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/profile', [AuthController::class, 'profile']);
    });
});




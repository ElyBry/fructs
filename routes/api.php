<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ColorsController;
use App\Http\Controllers\CountriesController;
use App\Http\Controllers\FeedBackController;
use App\Http\Controllers\FeedBackProductsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
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
        // О продуктах
    Route::get('feedBackProducts', [FeedBackProductsController::class,'getFeedBackProducts']);
        // О приложении
    Route::get('feedback', [FeedBackController::class,'getFeedBack']);
    // Страны
    Route::get('countries', [CountriesController::class,'index']);
    // Корзина
    Route::get('updateCart', [ProductsController::class, 'updateCart']);
    // Промокоды
    Route::middleware('throttle:100,600')->group(function () {
        Route::get('promoVerify', [PromoController::class, 'verify']);
    });
    // Способы оплаты
    Route::get('pays', [PaymentController::class, 'index']);
    // Точки
    Route::get('tradingPoints', [TradingPointsController::class , 'index']);

    Route::group([
        'middleware' => [
            'api'
        ]
    ], function () {
        // Заказы
        Route::get('orders', [OrderController::class, 'getOrders']);
        Route::get('orderItems/{id}', [OrderController::class, 'getOrderItems']);
        Route::post('doOrder', [OrderController::class, 'store'])->middleware('throttle:100,600');
    });
    // Для менеджера/ администратора
    Route::group([
        'middleware' => [
            'api',
            'role:Super Admin|Admin|Manager',
        ],
        'prefix' => 'products'
    ], function () {
        Route::post('/',[ProductsController::class, 'store']);
        Route::post('{product}',[ProductsController::class, 'update']);
        Route::delete('{product}', [ProductsController::class, 'delete']);
    });
    // Для администратора
    Route::group([
        'middleware' => [
            'api',
            'role:Super Admin|Admin'
        ],
        'prefix' => '/admin'
    ], function () {
        Route::resource('roles', RoleController::class);
        Route::resource('users', UserController::class);
        Route::resource('typeProducts', TypeProductsController::class);
        Route::resource('colors', ColorsController::class);
        Route::resource('countries', CountriesController::class);
        Route::resource('promo', PromoController::class);
        // Заказы
        Route::get('orderItems/{order_id}', [OrderController::class, 'indexItems']);
        Route::resource('orders', OrderController::class);
        Route::post('changeStatus', [OrderController::class, 'changeStatus']);

        Route::resource('feedBacks', FeedBackController::class);
        Route::resource('feedBacksProducts', FeedBackProductsController::class);
    });
    // Вход и регистрация без аутентификации
    Route::group([
        'prefix' => '/auth',
    ], function () {
        Route::post('register', [AuthController::class, 'register'])->withoutMiddleware('auth:api')
            ->middleware('throttle:10,14400');
        Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth:api')
            ->middleware('throttle:100,14400');
    });
    // При аутентификации
    Route::group([
        'middleware' => 'api',
        'prefix' => '/auth'
    ], function () {
        // Аккаунты
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/profile', [AuthController::class, 'profile']);
    });
    // ENV
    Route::get('/env', function() {
       return [
           'APP_URL' => env('APP_URL'),
       ];
    });
});




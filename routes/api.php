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
    Route::post('/auth/telegram/callback', [AuthController::class, 'handleTelegramCallback']);
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
        // Оставлял ли уже о приложении
    Route::get('getExist/{id}', [FeedBackController::class,'getExist']);
        // Оставлял ли уже о продукте
    Route::get('getExistProduct/{id}', [FeedBackProductsController::class,'getExistProduct']);
        // Добавить отзыв на приложение
    Route::post('addFeedback', [FeedBackController::class,'store']);
        // Добавить отзыв на продукт
    Route::post('addFeedbackProducts', [FeedBackProductsController::class,'store']);
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
        // Пользователи
        Route::resource('roles', RoleController::class);
        Route::resource('users', UserController::class);
        // Типы продуктов
        Route::post('typeProducts/{id}', [TypeProductsController::class, 'update']);
        Route::resource('typeProducts', TypeProductsController::class);
        // Цвета
        Route::resource('colors', ColorsController::class);
        // Страны
        Route::resource('countries', CountriesController::class);
        // Промокоды
        Route::resource('promos', PromoController::class);
        // Заказы
        Route::get('orderItems/{order_id}', [OrderController::class, 'indexItems']);
        Route::resource('orders', OrderController::class);
        Route::post('changeStatus', [OrderController::class, 'changeStatus']);
        // Отзывы
        Route::resource('feedBacks', FeedBackController::class);
        Route::resource('feedBacksProducts', FeedBackProductsController::class);
        // Точки
        Route::resource('tradingPoints', TradingPointsController::class);
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
});




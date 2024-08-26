<?php

use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::get('products', [ProductsController::class, 'index']);
Route::get('products/{product}', 'ProductsController@show');
Route::post('products','ProductsController@store');
Route::put('products/{product}','ProductsController@update');
Route::delete('products/{product}', 'ProductsController@delete');

<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;



Route::get('/login', function () {
    return view('SignInUp');
});
Route::get('/', function () {
    return view('main');
});
Route::get('/products', function () {
    return view('products');
});
Route::group([], function () {
    require base_path('routes/api.php');
});

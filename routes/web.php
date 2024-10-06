<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('{reactRoutes}', function () {
    return view('main'); // your start view
})->where('reactRoutes', '^((?!api).)*$');

Route::get('/login', function () {
    if (Auth::check()){
        return redirect('/products');
    }
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

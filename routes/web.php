<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('{reactRoutes}', function () {
    return view('main'); // your start view
})->where('reactRoutes', '^((?!api).)*$');

Route::group([], function () {
    require base_path('routes/api.php');
});

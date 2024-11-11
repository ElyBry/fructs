<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
Route::get('/auth/telegram/callback', [AuthController::class, 'handleTelegramCallback']);
Route::get('{reactRoutes}', function () {
    return view('main'); // your start view
})->where('reactRoutes', '^((?!api).)*$');

Route::group([], function () {
    require base_path('routes/api.php');
});

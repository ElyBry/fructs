<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return view('SignInUp');
});
Route::get('/', function () {
    return view('main');
})->withoutMiddleware([
    "web",
    "auth"
]);
Route::middleware('auth:api')->group(base_path('routes/api.php'));


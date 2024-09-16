<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends BaseController
{
    protected function respondWithToken($token)
    {
        return cookie('token', $token, auth()->factory()->getTTL() * 60,null,null,true,true);
    }
    public function register(Request $request) {

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if($validator->fails()){
            return $this->sendError('Ошибка валидации', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $user->assignRole('User');
        $success['user'] =  $user;

        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return $this->sendError('Ошибка.', ['error' => 'Неверно введён пароль или email'], 400);
        }
        $cookie = $this->respondWithToken($token);

        return $this->sendResponse($success, 'Пользователь успешно зарегистрирован')->withCookie($cookie);
    }
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return $this->sendError('Ошибка.', ['error' => 'Неверно введён пароль или email'], 400);
        }

        $success['user'] = auth()->user();
        $cookie = $this->respondWithToken($token);
        return $this->sendResponse($success, 'Пользователь успешно авторизован.')->withCookie($cookie);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        $success = auth()->user();

        return $this->sendResponse($success, 'Профиль пользователя успешно получен');
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return $this->sendResponse([], 'Successfully logged out.');
    }


    public function refresh()
    {
        $cookie = $this->respondWithToken(auth()->refresh());

        return $this->sendResponse('', 'Обновлённый токен успешно передан.')->withCookie($cookie);
    }



}

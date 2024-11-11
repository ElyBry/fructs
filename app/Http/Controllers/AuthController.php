<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\User;
use Azate\LaravelTelegramLoginAuth\TelegramLoginAuth;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends BaseController
{

    public function handleTelegramCallback(TelegramLoginAuth $telegramLoginAuth, Request $request)
    {
        try {
            $user = $telegramLoginAuth->validate($request);
        } catch (Exception $e) {
            return $this->sendError('Ошибка аутентификации через Telegram.', ['error' => $e->getMessage()], 400);
        }
        Log::error($user);
        $authUser = User::where('telegram_id', $user->getId())->first();
        if ($authUser) {
            auth()->login($authUser);
            $token = auth()->generateToken();

            $success['user'] = auth()->user();
            $success['role'] = auth()->user()->getRoleNames();
            $cookie = $this->respondWithToken($token);
            $isAuth = $this->respondWithSuccessAuth(true);
            return $this->sendResponse($success, 'Пользователь успешно авторизован.')
                ->withCookie($cookie)
                ->withCookie($isAuth);
        }

        $newUser = new User();
        $newUser->name = $user->getUsername();
        $newUser->password = bcrypt(Str::random(16));
        $newUser->save();

        auth()->login($newUser);
        $token = auth()->generateToken();

        $success['user'] = auth()->user();
        $success['role'] = auth()->user()->getRoleNames();
        $cookie = $this->respondWithToken($token);
        $isAuth = $this->respondWithSuccessAuth(true);
        return $this->sendResponse($success, 'Новый пользователь успешно зарегистрирован и авторизован.')
            ->withCookie($cookie)
            ->withCookie($isAuth);
    }

    protected function respondWithToken($token)
    {
        return cookie('token', $token, null,null,null,true,true)->withExpires(now()->addHour());
    }
    protected function respondWithSuccessAuth($is)
    {
        return cookie('is_authenticated', $is, null, null, null, false, false)->withExpires(now()->addHour());
    }
    public function register(Request $request) {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|min:10',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        if($validator->fails()){
            return $this->sendError('Ошибка валидации', $validator->errors(), 400);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $user->assignRole('User');

        return $this->login();
    }
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return $this->sendError('Ошибка.', ['error' => 'Неверно введён пароль или email'], 400);
        }

        $success['user'] = auth()->user();
        $success['role'] = auth()->user()->getRoleNames();
        $cookie = $this->respondWithToken($token);
        $isAuth = $this->respondWithSuccessAuth(true);
        return $this->sendResponse($success, 'Пользователь успешно авторизован.')
            ->withCookie($cookie)
            ->withCookie($isAuth);
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
        $isAuth = cookie('is_authenticated', '', -1);
        return $this->sendResponse([], 'Успешный выход из аккаунта.')->withCookie($isAuth);
    }


    public function refresh()
    {
        $cookie = $this->respondWithToken(auth()->refresh());
        $isAuth = $this->respondWithSuccessAuth(true);
        return $this->sendResponse('', 'Обновлённый токен успешно передан.')
            ->withCookie($cookie)
            ->withCookie($isAuth);
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Azate\LaravelTelegramLoginAuth\Contracts\Telegram\NotAllRequiredAttributesException;
use Azate\LaravelTelegramLoginAuth\Contracts\Validation\Rules\ResponseOutdatedException;
use Azate\LaravelTelegramLoginAuth\Contracts\Validation\Rules\SignatureException;
use Azate\LaravelTelegramLoginAuth\TelegramLoginAuth;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TelegramController extends AuthController
{
    public function handleTelegramCallback(TelegramLoginAuth $telegramLoginAuth, Request $request)
    {
        try {
            $user = $telegramLoginAuth->validateWithError($request);
            $existingUser = User::where('telegram_id', $user->getId())->first();

            if (!$existingUser) {
                $existingUser = User::create([
                    'name' => $user->getFirstName() . ' ' . $user->getLastName(),
                    'telegram_id' => $user->getId(),
                    'username' => $user->getUsername(),
                ]);
            }

            Auth::login($existingUser);

            $token = Auth::guard()->tokenById($existingUser->id);
            $success['user'] = auth()->user();
            $success['role'] = auth()->user()->getRoleNames();

            $cookie = $this->respondWithToken($token);
            $isAuth = $this->respondWithSuccessAuth(true);

            return $this->sendResponse($success, 'Пользователь успешно авторизован.')
                ->withCookie($cookie)
                ->withCookie($isAuth);
        } catch(NotAllRequiredAttributesException $e) {
            // ...
        } catch(SignatureException $e) {
            // ...
        } catch(ResponseOutdatedException $e) {
            // ...
        } catch(Exception $e) {
            // ...
        }
    }

}

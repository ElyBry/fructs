<?php

namespace App\Http\Controllers;

use Azate\LaravelTelegramLoginAuth\Contracts\Telegram\NotAllRequiredAttributesException;
use Azate\LaravelTelegramLoginAuth\Contracts\Validation\Rules\ResponseOutdatedException;
use Azate\LaravelTelegramLoginAuth\Contracts\Validation\Rules\SignatureException;
use Azate\LaravelTelegramLoginAuth\TelegramLoginAuth;
use Exception;
use Illuminate\Http\Request;

class TelegramController extends AuthController
{
    public function handleTelegramCallback(TelegramLoginAuth $telegramLoginAuth, Request $request)
    {
        try {
            $user = $telegramLoginAuth->validateWithError($request);
        } catch(NotAllRequiredAttributesException $e) {
            // ...
        } catch(SignatureException $e) {
            // ...
        } catch(ResponseOutdatedException $e) {
            // ...
        } catch(Exception $e) {
            // ...
        }

        // ...
    }

}

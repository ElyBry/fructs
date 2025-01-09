<?php

namespace App\Http\Controllers;

use App\Models\Notifications;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class TelegramController extends BaseController {
    protected $botToken;
    public function __construct()
    {
        $this->botToken = env('TELEGRAM_BOT_TOKEN');
    }
    public function validate(Request $auth_data)
    {
        $this->botToken = env('TELEGRAM_BOT_TOKEN');
        $check_hash = $auth_data->input('hash');
        $auth_data->request->remove('hash');

        $data_check_arr = [];
        foreach ($auth_data->request->all() as $key => $value) {
            $data_check_arr[] = $key . '=' . $value;
        }

        sort($data_check_arr);
        $data_check_string = implode("\n", $data_check_arr);
        $secret_key = hash('sha256', $this->botToken, true);
        $hash = hash_hmac('sha256', $data_check_string, $secret_key);

        if (strcmp($hash, $check_hash) !== 0) {
            throw new Exception('Data is NOT from Telegram');
        }

        if ((time() - $auth_data->input('auth_date')) > 86400) {
            throw new Exception('Data is outdated');
        }

        return $auth_data;
    }
    public function getUpdates()
    {
        $url = "https://api.telegram.org/bot" . $this->botToken . "/getUpdates";

        $response = file_get_contents($url);
        if (!$response) {
            throw new Exception('Ошбика получения данных');
        }

        return json_decode($response, true);
    }

    public function getAllChats()
    {
        $updates = $this->getUpdates();
        $chats = [];
        if (isset($updates['result'])) {
            foreach ($updates['result'] as $update) {
                if (isset($update['message']['chat']['id'])) {
                    $chats[] = $update['message']['chat']['id'];
                }
            }
        }

        return array_unique($chats);
    }

    public function handleWebhook(Request $request)
    {
        $update = $request->all();

        if (isset($update['message'])) {
            $chatId = $update['message']['chat']['id'];
            $text = $update['message']['text'];

            $user = User::where('telegram_id', $chatId)->first();
            if ($user) {
                $roles = $user->getRoleNames();
                $requiredRoles = ['Super Admin', 'Admin', 'Manager'];
                if ($roles->intersect($requiredRoles)->isNotEmpty()) {
                    if (Notifications::where('user_id', $chatId)->exists()) {
                        Notifications::where('user_id', $chatId)->delete();
                        $this->sendMessage($chatId, "Уведомления о заказах выключены");
                    } else {
                        Notifications::create([
                            'user_id' => $chatId,
                        ]);
                        $this->sendMessage($chatId, "Уведомления о заказах успешно подключены");
                    }
                } else {
                    $this->sendMessage($chatId, "Вы не администратор");
                }
            } else {
                $this->sendMessage($chatId, "Вы не являетесь пользователем https://fructs.ru ...");
            }
        }

        return response()->json(['status' => 'success']);
    }

    public function sendMessage($chatId, $message)
    {
        $url = "https://api.telegram.org/bot{$this->botToken}/sendMessage?chat_id={$chatId}&text=" . urlencode($message);
        file_get_contents($url);
    }

    public function setWebhook()
    {
        $url = env('APP_URL') . '/api/telegram-webhook';
        $setWebhookUrl = "https://api.telegram.org/bot{$this->botToken}/setWebhook?url={$url}";

        file_get_contents($setWebhookUrl);
    }
}

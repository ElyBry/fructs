<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller as Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BaseController extends Controller
{
    public function sendResponse($result, $message)
    {
        $response = [
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];

        return response()->json($response, 200);
    }
    public function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if(!empty($errorMessages)){
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }
    function generateUniqueFilename($directory, $length = 8) {
        $existingFiles = File::files($directory);
        $existingFilenames = collect($existingFiles)->map(function($file) {
            return $file->getFilename();
        })->toArray();

        while (true) {
            $randomName = Str::random($length) . '.webp';
            if (!in_array($randomName, $existingFilenames)) {
                return $randomName;
            }
        }
    }
}

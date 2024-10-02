<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedBackController extends BaseController
{
    public function index()
    {
        $query = Feedback::query();

        $feedbacks = $query->orderBy('created_at', 'desc')->paginate(10);

        return $feedbacks;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'user_name' => 'required',
            'message' => 'required',
            'rating' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }
        $input = $request->all();
        $feedBack = Feedback::create($input);
        return response()->json([$feedBack, 200]);
    }
    public function delete(Feedback $feedBack)
    {
        $feedBack->delete();
        return response()->json(null, 204);
    }
    public function approve(Request $request, Feedback $feedBack)
    {
        $feedBack->update($request->all());
        return $this->sendResponse($feedBack,'Успешно обновлено');
    }
}

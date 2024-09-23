<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\FeedBack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedBackController extends BaseController
{
    public function index()
    {
        $query = FeedBack::query();

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
        $feedBack = FeedBack::create($input);
        return response()->json([$feedBack, 200]);
    }
    public function delete(FeedBack $feedBack)
    {
        $feedBack->delete();
        return response()->json(null, 204);
    }
}

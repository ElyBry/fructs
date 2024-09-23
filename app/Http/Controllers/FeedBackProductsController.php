<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\FeedBackProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedBackProductsController extends BaseController
{
    public function index()
    {
        $query = FeedBackProducts::query();

        $feedbacks = $query->orderBy('created_at', 'desc')->paginate(10);

        return $feedbacks;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'user_name' => 'required',
            'product_id' => 'required',
            'message' => 'required',
            'rating' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }
        $input = $request->all();
        $feedBack = FeedBackProducts::create($input);
        return response()->json([$feedBack, 200]);
    }
    public function delete(FeedBackProducts $feedBack)
    {
        $feedBack->delete();
        return response()->json(null, 204);
    }
}

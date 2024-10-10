<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\FeedbackProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedBackProductsController extends BaseController
{
    public function index()
    {
        $query = FeedbackProducts::query();

        $feedbacks = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10);

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
        $feedBack = FeedbackProducts::create($input);
        return response()->json([$feedBack, 200]);
    }
    public function delete(FeedbackProducts $feedBack)
    {
        $feedBack->delete();
        return response()->json(null, 204);
    }
    public function approve(Request $request, FeedbackProducts $feedBackProducts)
    {
        $feedBackProducts->update($request->all());
        return $this->sendResponse($feedBackProducts,'Успешно обновлено');
    }
    public function getFeedBackProducts(Request $request)
    {
        $product_id = $request->input('product_id');
        $feedBackProducts = FeedbackProducts::query()
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->where('is_approved', true)
            ->where('product_id', $product_id)
            ->paginate(5);


        return $feedBackProducts;
    }
}

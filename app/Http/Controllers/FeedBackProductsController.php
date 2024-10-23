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
        $feedbacks = FeedbackProducts::query()
            ->leftJoin('products', 'feedback_products.product_id', '=', 'products.id')
            ->orderBy('feedback_products.created_at', 'desc')
            ->orderBy('feedback_products.id', 'desc')
            ->selectRaw('feedback_products.*, products.title as product_name')
            ->paginate(10);

        return $feedbacks;
    }
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'user_name' => 'required',
            'product_id' => 'required',
            'message' => 'required',
            'rating' => 'required',
        ], [
            'user_name.required' => 'Поле "ФИО" обязательно для заполнения.',
            'message.required' => 'Поле "Отзыв" обязательно для заполнения.',
            'rating.required' => 'Поле "Рейтинг" обязательно для заполнения.',
        ]);
        if ($this->getExistProduct($request->user_id, $request->product_id)) {
            return $this->sendError('Ошибка', ['error' => 'Отзыв о данном продукте уже существует'], 400);
        }
        $input = $request->all();
        $feedBack = FeedbackProducts::create($input);
        return response()->json([$feedBack, 200]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'product_id' => 'required',
            'user_name' => 'required',
            'message' => 'required',
            'rating' => 'required',
        ]);
        $input = $request->all();
        $feedback = FeedbackProducts::find($id);
        $feedback->update($input);
        return $this->sendResponse($feedback, 'Отзыв создан успешно');
    }

    public function delete(FeedbackProducts $feedBack)
    {
        $feedBack->delete();
        return response()->json(null, 204);
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
    public function getExistProduct($user_id, $product_id)
    {
        $exist = FeedbackProducts::query()
            ->where('product_id', $product_id)
            ->where('user_id', $user_id)
            ->exists();
        return $exist;
    }
}

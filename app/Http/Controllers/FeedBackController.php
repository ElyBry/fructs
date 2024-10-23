<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedBackController extends BaseController
{
    public function index()
    {
        $query = Feedback::query();

        $feedbacks = $query
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15);

        return $feedbacks;
    }
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'user_name' => 'required',
            'message' => 'required',
            'rating' => 'required',
        ]);
        if ($this->getExist($request->user_id) == 1) {
            return $this->sendError('',['error' => 'Вы уже оставляли отзыв, больше нельзя)'], 400);
        }
        $input = $request->all();
        $feedBack = Feedback::create($input);
        return $this->sendResponse($feedBack, 'Отзыв создан успешно');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'user_name' => 'required',
            'message' => 'required',
            'rating' => 'required',
        ]);
        $input = $request->all();
        $feedback = Feedback::find($id);
        $feedback->update($input);
        return $this->sendResponse($feedback, 'Отзыв создан успешно');
    }

    public function delete(Feedback $feedBack)
    {
        $feedBack->delete();
        return response()->json(null, 204);
    }

    public function getFeedBack()
    {
        $feedBack = Feedback::query()
            ->orderBy('created_at', 'desc')
            ->where('is_approved', 1)
            ->orderBy('id', 'desc')
            ->paginate(5);


        return $feedBack;
    }

    public function getExist($id)
    {
        $exist = Feedback::query()->where('user_id', $id)->exists();
        return $exist ? 1 : 0;
    }
}

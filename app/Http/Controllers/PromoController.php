<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Promos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PromoController extends BaseController
{
    public function index()
    {
        $query = Promos::query();

        $promo = $query->orderBy('created_at', 'desc')->paginate(10);

        return $promo;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'discount' => 'required|numeric|min:0|max:100',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }
        $input = $request->all();
        $promo = Promos::create($input);
        return response()->json([$promo, 200]);
    }
    public function delete(Promos $feedBack)
    {
        $feedBack->delete();
        return response()->json(null, 204);
    }
    public function update(Request $request, Promos $promo)
    {
        $promo->update($request->all());
        return $this->sendResponse($promo,'Успешно обновлено');
    }
}

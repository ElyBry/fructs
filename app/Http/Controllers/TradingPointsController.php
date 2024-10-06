<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TradingPoints;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TradingPointsController extends BaseController
{
    public function index()
    {
        $query = TradingPoints::query();

        $points = $query->orderBy('created_at', 'desc')->paginate(10);

        return $points;
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
        $points = TradingPoints::create($input);
        return response()->json([$points, 200]);
    }
    public function delete(TradingPoints $points)
    {
        $points->delete();
        return response()->json(null, 204);
    }
    public function update(Request $request, TradingPoints $points)
    {
        $points->update($request->all());
        return $this->sendResponse($points,'Успешно обновлено');
    }
}

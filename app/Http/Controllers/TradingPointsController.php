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
        $request->validate([
            'name' => 'required',
            'address' => 'required',
        ]);
        $input = $request->all();
        $points = TradingPoints::create($input);
        return $this->sendResponse($points, 'Успешно добавлено.');
    }
    public function destroy($id)
    {
        $points = TradingPoints::find($id);
        $points->delete();
        return $this->sendResponse(null, 'Успешно удалено.');
    }
    public function update(Request $request, $id)
    {
        $points = TradingPoints::find($id);
        $points->update($request->all());
        return $this->sendResponse($points,'Успешно обновлено');
    }
}

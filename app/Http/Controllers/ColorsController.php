<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\Colors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ColorsController extends BaseController
{
    public function index()
    {
        $query = Colors::query();
        $colors = $query->get();
        return $colors;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }
        $input = $request->all();
        $colors = Colors::create($input);
        return response()->json([$colors, 200]);
    }
    public function delete(Colors $colors)
    {
        $colors->delete();
        return response()->json(null, 204);
    }
}

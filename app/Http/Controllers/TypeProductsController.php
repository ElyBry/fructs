<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\TypeProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TypeProductsController extends BaseController
{
    public function index()
    {
        $query = TypeProducts::query();

        $types = $query->orderBy('created_at', 'desc')->paginate(10);

        return $types;
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
        $types = TypeProducts::create($input);
        return response()->json([$types, 200]);
    }
    public function edit(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
        ]);
        $input = $request->all();
        $types = TypeProducts::find($id);
        $types->update($input);
        return response()->json([$types, 200]);
    }
    public function delete(TypeProducts $types)
    {
        $types->delete();
        return response()->json(null, 204);
    }
    public function getNewTypeProducts()
    {
        $type = TypeProducts::orderBy('created_at', 'desc')->first();
        return $type;
    }
    public function getAllTypeProducts()
    {
        $typesProducts = TypeProducts::all();
        return $typesProducts;
    }
}

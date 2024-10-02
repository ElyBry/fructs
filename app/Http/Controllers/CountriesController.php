<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\Countries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CountriesController extends BaseController
{
    public function index(Request $request)
    {
        $query = $request->input('country');
        $countries = Countries::query()
            ->where('name', 'like', $query . '%')->paginate(5);
        return $countries;
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
        $countries = Countries::create($input);
        return response()->json([$countries, 200]);
    }
    public function delete(Countries $countries)
    {
        $countries->delete();
        return response()->json(null, 204);
    }
}

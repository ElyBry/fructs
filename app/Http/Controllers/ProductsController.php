<?php

namespace App\Http\Controllers;
use App\Http\Controllers\BaseController as BaseController;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductsController extends BaseController
{
    public function index()
    {
        return Product::all();
    }
    public function show(Product $product)
    {
        return $product;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|unique:products|max:255',
            'description' => 'required',
            'price' => 'integer',
            'available' => 'boolean'
        ]);
        if($validator->fails()){
            return $this->sendError('Ошибка валидации', $validator->errors());
        }
        $product = Product::create($request->all());
        return response()->json($product, 201);
    }
    public function update(Request $request, Product $product)
    {
        $product->update($request->all());
        return response()->json($product, 200);
    }
    public function delete(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;
use App\Http\Controllers\BaseController as BaseController;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProductsController extends BaseController
{
    public function index(Request $request)
    {
        $query = Product::query();
        if ($request->has('name') && $request->get('name') != '') {
            $query->where('title', 'like', '%' . $request->get('name') . '%');
        }
        if ($request->has('min_price') && $request->get('min_price') != '') {
            $query->where('price','>=',$request->get('min_price'));
        }
        if ($request->has('max_price') && $request->get('max_price') != '') {
            $query->where('price','<=',$request->get('max_price'));
        }
        if ($request->has('type_products_id') && $request->get('types') != '') {
            $query->where('type_products_id', $request->get('types'));
        }
        $products = $query->orderBy('created_at', 'desc')->orderBy('id', 'desc')->paginate(12);

        return $products;
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
        return $this->sendResponse($product,'Успешно добавлено');
    }
    public function update(Request $request, Product $product)
    {
        $product->update($request->all());
        return $this->sendResponse($product,'Успешно обновлено');
    }
    public function delete(Product $product)
    {
        $product->delete();
        return $this->sendResponse(null, 'Успешно удалено');
    }
}

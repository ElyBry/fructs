<?php

namespace App\Http\Controllers;
use App\Http\Controllers\BaseController as BaseController;

use App\Models\OrderItems;
use App\Models\Product;
use App\Models\TypeProducts;
use Carbon\Carbon;
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
        if ($request->has('types') && !empty($request->get('types'))) {
            $query->whereIntegerInRaw('type_products_id', $request->get('types'));
        }
        if ($request->has('color_id') && !empty($request->get('color_id'))) {
            $query->whereIntegerInRaw('color_products_id', $request->get('color_id'));
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
    public function getMostPopularProduct()
    {
        $product = OrderItems::select('product_id', DB::raw('sum(quantity) as total_quantity'))
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('created_at', [
                Carbon::now()->subMonth()->startOfMonth(),
                Carbon::now()->subMonth()->endOfMonth(),
            ])
            ->groupBy('order_items.product_id')
            ->orderBy('total_quantity', 'desc')
            ->first();
        if (!$product) {
            $product = OrderItems::select('product_id', DB::raw('sum(quantity) as total_quantity'))
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->groupBy('order_items.product_id')
                ->orderBy('total_quantity', 'desc')
                ->first();
        }
        $productId = $product->product_id;
        $product =  Product::find($productId);

        return $product;
    }
    public function getNewCategory()
    {
        $type = TypeProducts::orderBy('created_at', 'desc')->first();
        return $type;
    }
    public function getNewProduct()
    {
        $product = Product::orderBy('created_at', 'desc')->first();
        return $product;
    }
    public function getAllTypeProducts()
    {
        $typesProducts = TypeProducts::all();
        return $typesProducts;
    }
    public function getAllColors()
    {
        $colors = DB::table("colors")->get();
        return $colors;
    }
}

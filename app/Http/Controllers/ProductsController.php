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
        if ($request->has('color') && !empty($request->get('color'))) {
            $query->whereIntegerInRaw('color_id', $request->get('color'));
        }
        if ($request->has('countries') && !empty($request->get('countries'))) {
            $query->whereIntegerInRaw('country_id', $request->get('countries'));
        }
        $direction = 'desc';
        if ($request->has('ascendingSort') && $request->get('ascendingSort') != '') {
            $direction = $request->get('ascendingSort');
        }
        if ($request->has('howSort') && $request->get('howSort') != '') {
            $howSort = $request->get('howSort');
            if ($howSort == 'Popular') {
                $products = DB::table('products')
                    ->leftJoin('order_items', 'products.id', '=','order_items.product_id')
                    ->selectRaw('products.id,title,img,price,weight')
                    ->groupBy('products.id')
                    ->orderByRaw('SUM(order_items.quantity)' . $direction);
            } else if ($howSort == 'New') {
                $columnSort = 'created_at';
                $products = $query->orderBy($columnSort, $direction)->orderBy('id', 'desc');
            } else if ($howSort == 'Costs') {
                $columnSort = 'price';
                $products = $query->orderBy($columnSort, $direction)->orderBy('id', 'desc');
            } else if ($howSort == 'Feedback') {
                $products = DB::table('products')
                    ->leftJoin('feedback_products', 'products.id', '=','feedback_products.product_id')
                    ->selectRaw('products.id,title,img,price,weight,count(feedback_products.product_id) as count_feeds, round(SUM(feedback_products.rating)/count(feedback_products.product_id),2) as rating ')
                    ->groupBy('products.id')
                    ->orderBy('rating', $direction)
                    ->orderBy('count_feeds', $direction);
            }
        }
        if (!isset($products)) {
            return $this->sendError('Продукты не найдены');
        } else {
            return $products->paginate(12);
        }

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
    public function getCountry(Request $request)
    {
        $query = $request->input('country');
        $countries = DB::table("countries")
            ->where('name', 'like', $query . '%')->paginate(5);
        return $countries;
    }
}

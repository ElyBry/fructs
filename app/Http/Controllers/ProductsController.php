<?php

namespace App\Http\Controllers;
use App\Http\Controllers\BaseController as BaseController;

use App\Models\OrderItems;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProductsController extends BaseController
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->where('count', '>', 0)
            ->leftJoin('feedback_products', 'products.id', '=', 'feedback_products.product_id')
            ->leftJoin('countries', 'products.country_id', '=', 'countries.id')
            ->groupBy('products.id')
            ->selectRaw('count, type_weight, countries.name as country, products.id, title, img, description, price, weight, COUNT(DISTINCT feedback_products.id) AS count_feeds, ROUND(AVG(feedback_products.rating), 2) AS average_rating');
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
        if ($request->has('min_rate') && $request->get('min_rate') != '') {
            $query->having('average_rating','>=',$request->get('min_rate'));
        }
        if ($request->has('max_rate') && $request->get('max_rate') != '') {
            $query->having('average_rating','<=',$request->get('max_rate'));
        }
        $direction = 'desc';
        if ($request->has('ascendingSort') && $request->get('ascendingSort') != '') {
            $direction = $request->get('ascendingSort');
        }
        if ($request->has('howSort') && $request->get('howSort') != '') {
            $howSort = $request->get('howSort');
            if ($howSort == 'Popular') {
                $query->leftJoin('order_items', 'products.id', '=','order_items.product_id')
                    ->orderByRaw('count(DISTINCT order_items.id)' . $direction);
            } else if ($howSort == 'New') {
                $query->orderBy('products.created_at', $direction)
                    ->orderBy('products.updated_at', $direction);
            } else if ($howSort == 'Costs') {
                $query->orderBy('products.price', $direction);
            } else if ($howSort == 'Feedback') {
                $query->orderBy('average_rating', $direction)
                    ->orderBy('count_feeds', $direction);
            }
        }
        $products = $query->orderBy('products.id', 'desc')
            ->paginate(12);

        return $products;
    }
    public function getProductOrderCount(Request $request)
    {
        if (!$request->has('product_id')) return $this->sendError('Product_id не найден в запросе', 404);
        $product_id = $request->get('product_id');
        return DB::table('order_items')
            ->where('product_id', $product_id)
            ->count();
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|unique:products|max:255',
            'description' => 'required',
            'price' => 'integer',
            'type_weight' => 'string',
            'weight' => 'integer',
            'img' => 'string',
            'type_products_id' => 'integer',
            'color_id' => 'integer',
            'country_id' => 'integer',
            'count' => 'number'
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
        $product = Product::query()
            ->select('products.id', 'products.title', 'products.img', 'products.description', 'products.price',
                'products.weight','count',
                'products.type_weight')
            ->selectRaw('COUNT(DISTINCT feedback_products.id) AS count_feeds,
                ROUND(AVG(feedback_products.rating), 2) AS average_rating,
                count(DISTINCT order_items.id) as order_count')
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('feedback_products', 'products.id', '=', 'feedback_products.product_id')
            ->leftJoin('countries', 'products.country_id', '=', 'countries.id')
            ->whereBetween('orders.created_at', [
                Carbon::now()->subDays(30)->startOfDay(),
                Carbon::now()->endOfDay(),
            ])
            ->groupBy('products.id')
            ->orderBy('order_count', 'desc')
            ->orderBy('average_rating', 'desc')
            ->orderBy('count_feeds', 'desc')
            ->having('average_rating', '>=', 4)
            ->first();
        if (!$product){
            $product = Product::query()
                ->select('products.id', 'products.title', 'products.img', 'products.description', 'products.price',
                    'products.weight','count',
                    'products.type_weight')
                ->selectRaw('COUNT(DISTINCT feedback_products.id) AS count_feeds,
                ROUND(AVG(feedback_products.rating), 2) AS average_rating,
                count(DISTINCT order_items.id) as order_count')
                ->join('order_items', 'products.id', '=', 'order_items.product_id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->leftJoin('feedback_products', 'products.id', '=', 'feedback_products.product_id')
                ->leftJoin('countries', 'products.country_id', '=', 'countries.id')
                ->groupBy('products.id')
                ->orderBy('order_count', 'desc')
                ->orderBy('average_rating', 'desc')
                ->orderBy('count_feeds', 'desc')
                ->having('average_rating', '>=', 4)
                ->first();
        }
        return $product;
    }
    public function getNewProduct()
    {
        $product = Product::Query()
            ->leftJoin('feedback_products', 'products.id', '=', 'feedback_products.product_id')
            ->leftJoin('countries', 'products.country_id', '=', 'countries.id')
            ->groupBy('products.id')
            ->selectRaw('count, type_weight, countries.name as country, products.id, title, img, description, price, weight, COUNT(feedback_products.product_id) AS count_feeds, ROUND(AVG(feedback_products.rating), 2) AS average_rating')
            ->first();
        return $product;
    }

    public function updateCart(Request $request)
    {
        if ($request->has('productsIds')) {
            $ids = $request->get('productsIds');
            $products = Product::whereIn('id', $ids)->get(['id','price','count']);
            $result = $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'price' => $product->price,
                    'count' => $product->count,
                ];
            });

            return $result;
        }
        return $this->sendError('Id не найдены', 400);
    }
}

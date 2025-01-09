<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Mail\SendOrder;
use App\Models\Notifications;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItems;
use App\Models\Reservations;
use App\Models\User;
use Composer\XdebugHandler\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OrderController extends BaseController
{
    public function index()
    {
        return Order::query()
            ->leftJoin('order_statuses', 'orders.payment_status_id', '=', 'order_statuses.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->orderBy('orders.created_at', 'desc')
            ->selectRaw('orders.*, order_statuses.name as payment_status_name, users.name as user_name')
            ->paginate(10);
    }
    public function indexItems($order_id)
    {
        return OrderItems::query()
            ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
            ->where('order_id', $order_id)
            ->get();
    }

    public function getOrders(Request $request)
    {
        if (auth()->check()) $user = auth()->user(); else {
            return $this->sendError('Ошибка аутентификации', ['error' => 'Не аутентифицирован'],401);
        }
        $user_id = $user["id"];
        $orders = Order::query()
            ->leftJoin('order_statuses', 'orders.payment_status_id', '=', 'order_statuses.id')
            ->where('user_id', $user_id)
            ->orderBy('orders.created_at', 'desc')
            ->selectRaw('orders.*, order_statuses.name as payment_status_id')
            ->paginate(10);
        return $orders;
    }

    public function getOrderItems($order_id)
    {
        if (auth()->check()) $user = auth()->user(); else {
            return $this->sendError('Ошибка аутентификации', ['error' => 'Не аутентифицирован'],401);
        }
        $user_id = $user["id"];
        if (!$order_id) {
            return $this->sendError('Id не найден', ['error' => 'Id не найден'], 401);
        }

        $order = Order::find($order_id);
        if (!$order || $order->user_id != $user_id) {
            return $this->sendError('Ошибка доступа', ['error' => 'Вы не имеете доступ к заказу'], 403);
        }
        $order_items = OrderItems::query()
            ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
            ->select('order_items.*', 'products.*',
                DB::raw("(SELECT COUNT(*) FROM feedback_products WHERE feedback_products.product_id = order_items.product_id AND feedback_products.user_id = $user_id) AS feedback_exists",)
            )
            ->where('order_id', $order_id)
            ->orderBy('order_items.id', 'desc')
            ->get();
        return $order_items;
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required',
            'number' => 'required|min:9',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|integer|min:1',
            'total_price' => 'required',
            'payment_method_id' => 'required',
            'payment_status_id' => 'required'
        ]);
        if ($validator->fails()) {
            return $this->sendError('Ошибка данных', $validator->errors(), 400);
        }
        if (auth()->check()) $user_id = auth()->user()["id"]; else {
            return $this->sendError('Ошибка аутентификации', ['error' => 'Не аутентифицирован'],401);
        }

        $input = $request->all();

        $totalCalcPrice = 0;
        foreach ($input['cart'] as $product) {
            $dbProduct = Product::findOrFail($product['id']);
            if ($product['quantity'] > $dbProduct->count) {
                return $this->sendError('Нехватка продуктов', ['error' => "Продукта {$product['title']} не хватает"], 400);
            }

            if ($dbProduct->price !== $product['price']) {
                return $this->sendError('Стоимость продукта не соответствует актуальной',
                    [
                        'product_id' => $product['id'],
                        'expected_price' => $dbProduct->price,
                        'given_price' => $product['price']
                    ]
                );
            }
            $totalCalcPrice += $product['price'] * $product['quantity'];
        }
        if ($totalCalcPrice != $input['total_price']) {
            return $this->sendError('Итог стоимости не совпадает', [
                'expected_total_price' => $totalCalcPrice,
                'given_total_price' => $input['total_price']
            ]);
        }

        if ($input['promo'] !== '') {
            $promo = DB::table('promos')
                ->where('id', $input['promo'])
                ->where('count','>',0)
                ->first();
            if ($promo) {
                if ($promo->discount != $input['discount_percent']) {
                    return $this->sendError('Процент скидки не совпадает',[
                        "expected_discount_percent" => $promo->discount,
                        "given_discount_percent" => $input['discount_percent']
                    ]);
                }
                $promo->update(['count' => $promo->count - 1]);
            }
        }
        $orderArray = [
            'user_id' => $user_id,
            'picked_trade_point' => $input['picked_trade_point'],
            'number' => $input['number'],
            'address' => $input['address'],
            'total_price' => $input['total_price'],
            'discount_percent' => $input['discount_percent'],
            'cost_with_discount' => $input['cost_with_discount'],
            'how_deliver' => $input['how_deliver'],
            'how_connect' => $input['how_connect'],
            'how_social' => $input['how_social'],
            'discount' => $input['discount'],
            'payment_method_id' => $input['payment_method_id'],
            'payment_status_id' => $input['payment_status_id'],
            'quantity' => $input['quantity'],
            'comment' => $input['comment'],
        ];
        $order = Order::create($orderArray);
        $orderArray['id'] = $order->id;

        foreach ($input['cart'] as $product) {
            OrderItems::create([
                'order_id' => $order->id,
                'product_id' => $product['id'],
                'quantity' => $product['quantity'],
                'total_price' => $product['price'],
            ]);
            $dbProduct = Product::find($product['id']);
            $dbProduct->count -= $product['quantity'];
            $dbProduct->save();

            Reservations::create([
                'order_id' => $order->id,
                'product_id' => $product['id'],
                'reserved_quantity' => $product['quantity']
            ]);
        }
        $emails = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'manager', 'Super Admin']);
        })->pluck('email')->toArray();

        foreach ($emails as $email) {
            if ($email) {
                Mail::to($email)->send(new SendOrder($orderArray));
            }
        }
        $telegramController = new TelegramController();
        $notifications = Notifications::all();

        foreach ($notifications as $notification) {
            $telegramController->sendMessage($notification->user_id, "Новый заказ " . $order->id . " на сумму " . $order->total_price . "р. Номер телефона: " . $order->number);
        }

        return response()->json([$order, 200]);
    }
    public function edit(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required',
            'address' => 'required',
            'product_id' => 'required',
            'quantity' => 'required',
            'total_price' => 'required',
            'payment_method_id' => 'required',
            'payment_status_id' => 'required'
        ]);
        $input = $request->all();
        $order = Order::find($id);
        $order->update($input);
        return response()->json([$order, 200]);
    }
    public function changeStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'payment_status_id' => 'required',
        ]);
        $order = Order::find($request['order_id']);
        $order->update([
            'payment_status_id' => $request['payment_status_id'],
        ]);
        $status = DB::table('order_statuses')->where('id', $order->payment_status_id)->first();
        if ($request['payment_status_id'] == 5) {
            $orderItems = OrderItems::query()
                ->where('order_id', $order->id)
                ->get();
            foreach ($orderItems as $orderItem) {
                $product = Product::find($orderItem->product_id);
                if ($product) {
                    $product->count += $orderItem->quantity;
                    $product->save();
                }
            }
            Reservations::query()->where('order_id', $order->id)->delete();
        }
        if ($request['payment_status_id'] == 4) {
            Reservations::query()->where('order_id', $order->id)->delete();
        }
        $response = ['id' => $order->id, 'payment_status_id' => $order->payment_status_id, 'payment_status_name' => $status->name];
        return response()->json([$response, 200]);
    }
    public function delete(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }
}

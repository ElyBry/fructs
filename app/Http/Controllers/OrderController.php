<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends BaseController
{
    public function index()
    {
        $query = Order::query();

        $feedbacks = $query->orderBy('created_at', 'desc')->paginate(10);

        return $feedbacks;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'adress' => 'required',
            'product_id' => 'required',
            'quantity' => 'required',
            'total_price' => 'required',
            'payment_method_id' => 'required',
            'payment_status_id' => 'required'
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }
        $input = $request->all();
        $feedBack = Order::create($input);
        return response()->json([$feedBack, 200]);
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
        if (in_array($request['payment_status_id'],[0, 1])) {
            return $this->sendError('Невозможно изменить заказ', 'Курьер уже в пути');
        }
        $input = $request->all();
        $order = Order::find($id);
        $order->update($input);
        return response()->json([$order, 200]);
    }
    public function changeStatus(Request $request, Order $order)
    {
        $request->validate([
            'payment_status_id' => 'required',
        ]);
        $order->update([
            'payment_status_id' => $request['payment_status_id'],
        ]);
        return response()->json([$order, 200]);
    }
    public function delete(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }
}

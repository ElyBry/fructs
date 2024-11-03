<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Promos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PromoController extends BaseController
{
    public function index()
    {
        $query = Promos::query();

        $promo = $query->orderBy('created_at', 'desc')->paginate(10);

        return $promo;
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'discount' => 'required|numeric|min:0|max:100',
        ]);
        $input = $request->all();
        $promo = Promos::create($input);
        return $this->sendResponse($promo, "Успешно добавлено");
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'discount' => 'required|numeric|min:0|max:100',
        ]);
        $promo = Promos::find($id);
        $promo->update($request->all());
        return $this->sendResponse($promo,'Успешно обновлено');
    }
    public function destroy($id)
    {
        $promo = Promos::find($id);
        $promo->delete();
        return $this->sendResponse(null, 'Успешно удалено.');
    }
    public function verify(Request $request)
    {
        $name = $request->input('name');
        $promos = Promos::query()
            ->where("name", "=", strtoupper($name))
            ->where('count', ">" , 0)
            ->first();
        if ($promos && $promos->count > 0) {
            return $this->sendResponse($promos->discount, "Промокод успешно введён");
        }
        return $this->sendResponse(0, "Промокод не найден");
    }
}

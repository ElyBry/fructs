<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController
{
    public function index()
    {
        return DB::table('payment_methods')
            ->get();
    }
}

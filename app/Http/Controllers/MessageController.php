<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Faker\Factory;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function sendMessage(Request $request) {
        if (!session()->has('name')) {
            session()->put('name', Factory::create()->userName());
        }
        MessageSent::dispatch(session()->get('name'), $request->message);
        return response()->json([
            'status' => 'success',
            'message' => 'pesan berhasil ditambahkan'
        ]);
    }
}

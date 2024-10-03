<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Faker\Factory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function sendMessage(Request $request) {
        $user = Auth::user()->name;
        MessageSent::dispatch($user, $request->message);
        return response()->json([
            'status' => 'success',
            'message' => 'pesan berhasil ditambahkan'
        ]);
    }
}

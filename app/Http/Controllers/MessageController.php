<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

class MessageController extends Controller
{
    public function sendMessage(Request $request) {
        $userActive = Auth::user();
        $recipientId = Crypt::decryptString($request->input('user_id'));
        $messageText = $request->input('text');

        $conversation = Conversation::whereHas('users', function ($query) use ($userActive, $recipientId) {
            $query->whereIn('user_id', [$userActive->id, $recipientId]);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create();
            $conversation->users()->attach([$userActive->id, $recipientId]);
        }

        Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $userActive->id,
            'text' => $messageText
        ]);

        MessageSent::dispatch($userActive->name, $messageText);
        return response()->json([
            'status' => 'success',
            'message' => 'Pesan berhasil dikirim',
            'conversation_id' => $conversation->id
        ]);
    }
}
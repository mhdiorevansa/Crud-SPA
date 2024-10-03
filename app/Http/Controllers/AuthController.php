<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login()
    {
        $data['web'] = ['title' => 'Login'];
        return view('login', $data);
    }

    public function authenticating(Request $request) {
        $messages = [
            'name.required' => 'username wajib diisi',
            'password.required' => 'password wajib diisi',
        ];
        $credentials = $request->validate([
            'name' => 'required',
            'password' => 'required'
        ], $messages);
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $response = [
                'status' => 'success',
                'message' => 'Berhasil Login',
                'url' => url('/dashboard')
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Periksa kembali username dan password'
            ];
        }
        return response()->json($response);
    }
}

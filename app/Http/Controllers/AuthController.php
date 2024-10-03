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

    public function authenticating(Request $request)
    {
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

    public function logout(Request $request)
    {
        try {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            $response = [
                'status' => 'success',
                'message' => 'Berhasil logout',
                'url' => url('/login')
            ];
        } catch (\Throwable $th) {
            $response = [
                'status' => 'error',
                'message' => 'Sepertinya ada masalah',
                'error' => $th->getMessage()
            ];
        }
        return response()->json($response);
    }
}

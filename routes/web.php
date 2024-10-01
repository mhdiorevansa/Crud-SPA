<?php

use App\Events\MessageSent;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use Faker\Factory;
use Illuminate\Http\Request;

Route::get('/', [DashboardController::class, 'index']);
Route::get('/item', [DashboardController::class, 'getBarang']);
Route::post('/item-create', [DashboardController::class, 'postBarang']);
Route::get('/item-edit/{id}', [DashboardController::class, 'editBarang']);
Route::put('/item-update/{id}', [DashboardController::class, 'updateBarang']);
Route::delete('/item-delete/{id}', [DashboardController::class, 'deleteBarang']);

Route::post('/message-sent', function (Request $request) {
   if(!session()->has('name'))
      session()->put('name', Factory::create()->userName);
   MessageSent::dispatch(session()->get('name'), $request->message);
   return response()->json([
      'status' => 'success',
      'message' => 'Pesan telah dikirim',
   ]);
});

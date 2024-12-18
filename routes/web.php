<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\MessageController;

Route::redirect('/', '/dashboard');

// throttle untuk rate limiting
Route::group(['middleware' => ['guest', 'throttle:5,1']], function () {
   Route::get('/login', [AuthController::class, 'login'])->name('login');
   Route::post('/authenticating',
      [AuthController::class, 'authenticating']
   );
   Route::get('login/google', [GoogleController::class, 'redirectToGoogle']);
   Route::get('login/google/callback', [GoogleController::class, 'handleGoogleCallback']);
});

Route::group(['middleware' => ['auth'], 'prefix' => 'dashboard'], function () {
   Route::get('/', [DashboardController::class, 'index']);
   Route::get('/item-all', [DashboardController::class, 'getBarang']);
   Route::post('/item-create', [DashboardController::class, 'postBarang']);
   Route::get('/item-edit/{id}', [DashboardController::class, 'editBarang']);
   Route::put('/item-update/{id}', [DashboardController::class, 'updateBarang']);
   Route::delete('/item-delete/{id}', [DashboardController::class, 'deleteBarang']);
   Route::get('/get-all-user', [DashboardController::class, 'getAllUser']);
   Route::get('/data-kampus', [DashboardController::class, 'getDataKampus']);
   Route::get('/logout', [AuthController::class, 'logout']);
});

Route::group(['middleware' => ['auth', 'throttle:40,1']], function () {
   Route::post('/message-sent', [MessageController::class, 'sendMessage']);
});

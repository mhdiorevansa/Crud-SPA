<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;

Route::group(['middleware' => 'guest'], function () {
   Route::get('/login', [AuthController::class, 'login'])->name('login');
   Route::post('/authenticating', [AuthController::class, 'authenticating']);
});

Route::group(['middleware' => ['auth'], 'prefix' => 'dashboard'], function () {
   Route::get('/', [DashboardController::class, 'index']);
});

Route::group(['middleware' => ['auth'], 'prefix' => 'item'], function () {
   Route::get('/', [DashboardController::class, 'getBarang']);
   Route::post('/item-create', [DashboardController::class, 'postBarang']);
   Route::get('/item-edit/{id}', [DashboardController::class, 'editBarang']);
   Route::put('/item-update/{id}', [DashboardController::class, 'updateBarang']);
   Route::delete('/item-delete/{id}', [DashboardController::class, 'deleteBarang']);
});

Route::group(['middleware' => 'auth'], function(){
   Route::post('/message-sent', [MessageController::class, 'sendMessage']);
});

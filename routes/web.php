<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/', [DashboardController::class, 'index']);
Route::get('/item', [DashboardController::class, 'getBarang']);
Route::post('/item-create', [DashboardController::class, 'postBarang']);

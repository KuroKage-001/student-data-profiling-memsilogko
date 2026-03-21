<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResearchMaterialController;
use App\Http\Controllers\InstructionController;

// Handle preflight OPTIONS requests
Route::options('{any}', function () {
    return response('', 200);
})->where('any', '.*');

Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Research Materials API Routes
Route::apiResource('research-materials', ResearchMaterialController::class);

// Instructions API Routes
Route::apiResource('instructions', InstructionController::class);

// User Management API Routes (Protected)
Route::middleware('auth:api')->group(function () {
    Route::apiResource('users', App\Http\Controllers\UserManagementController::class);
    Route::get('users-statistics', [App\Http\Controllers\UserManagementController::class, 'statistics']);
});

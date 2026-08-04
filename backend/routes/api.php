<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CadastroController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me'])->middleware('jwt');

Route::get('/cep/{cep}', [CadastroController::class, 'buscarCep']);

Route::middleware('jwt')->group(function () {
    Route::get('/cadastros', [CadastroController::class, 'index']);
    Route::post('/cadastros', [CadastroController::class, 'store']);
    Route::put('/cadastros/{id}', [CadastroController::class, 'update']);
    Route::delete('/cadastros/{id}', [CadastroController::class, 'destroy']);
});

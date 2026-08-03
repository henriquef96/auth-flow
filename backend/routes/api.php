<?php

use App\Http\Controllers\CadastroController;
use Illuminate\Support\Facades\Route;

// Busca de CEP
Route::get('/cep/{cep}', [CadastroController::class, 'buscarCep']);

// CRUD de Cadastros
Route::get('/cadastros', [CadastroController::class, 'index']);          // Listar
Route::post('/cadastros', [CadastroController::class, 'store']);         // Cadastrar
Route::put('/cadastros/{id}', [CadastroController::class, 'update']);    // Editar
Route::delete('/cadastros/{id}', [CadastroController::class, 'destroy']);// Excluir

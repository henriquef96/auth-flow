<?php

namespace App\Http\Controllers;

use App\Models\Cadastro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Exception;

class CadastroController extends Controller
{
    // Endpoint de busca de CEP com Cache
    public function buscarCep(string $cep)
    {
        try {
            $cepLimpo = preg_replace('/[^0-9]/', '', $cep);

            if (strlen($cepLimpo) !== 8) {
                return response()->json(['erro' => 'CEP inválido.'], 400);
            }

            $cacheKey = "cep_{$cepLimpo}";

            $dadosFormatados = Cache::remember($cacheKey, now()->addDays(30), function () use ($cepLimpo, $cep) {
                $response = Http::get("https://viacep.com.br/ws/{$cepLimpo}/json/");

                if ($response->failed() || isset($response->json()['erro'])) {
                    return null;
                }

                $dados = $response->json();

                return [
                    "cep" => $dados['cep'] ?? $cep,
                    "logradouro" => $dados['logradouro'] ?? '',
                    "bairro" => $dados['bairro'] ?? '',
                    "cidade" => $dados['localidade'] ?? '',
                    "uf" => $dados['uf'] ?? ''
                ];
            });

            if (!$dadosFormatados) {
                return response()->json(['erro' => 'CEP não encontrado.'], 404);
            }

            return response()->json($dadosFormatados, 200);
        } catch (Exception $e) {
            return response()->json([
                'erro' => 'Erro interno ao consultar o CEP.',
                'detalhes' => $e->getMessage()
            ], 500);
        }
    }

    // Endpoint de cadastro
    public function store(Request $request)
    {
        try {
            $dadosValidados = $request->validate([
                'nome' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'cep' => 'required|string|max:10',
                'logradouro' => 'required|string|max:255',
                'numero' => 'required|string|max:50',
                'complemento' => 'nullable|string|max:255',
                'bairro' => 'required|string|max:255',
                'cidade' => 'required|string|max:255',
                'uf' => 'required|string|size:2',
            ]);

            $cadastro = Cadastro::create($dadosValidados);
            return response()->json([
                'mensagem' => 'Cadastro realizado com sucesso!',
                'dados' => $cadastro
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'erro' => 'Erro de validação.',
                'detalhes' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'erro' => 'Erro ao realizar o cadastro.',
                'detalhes' => $e->getMessage()
            ], 500);
        }
    }

    // Endpoint de listagem com paginação (5 por página)
    public function index(Request $request)
    {
        try {
            $page = $request->get('page', 1);
            $cadastros = Cadastro::query()
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->paginate(5, ['*'], 'page', $page);

            return response()->json($cadastros->items(), 200);
        } catch (Exception $e) {
            return response()->json([
                'erro' => 'Erro ao listar os cadastros.',
                'detalhes' => $e->getMessage()
            ], 500);
        }
    }

    // Endpoint de edição
    public function update(Request $request, $id)
    {
        try {
            $cadastro = Cadastro::find($id);

            if (!$cadastro) {
                return response()->json(['mensagem' => 'Cadastro não encontrado.'], 404);
            }

            $dadosValidados = $request->validate([
                'nome' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255',
                'cep' => 'sometimes|string|max:10',
                'logradouro' => 'sometimes|string|max:255',
                'numero' => 'sometimes|string|max:50',
                'complemento' => 'nullable|string|max:255',
                'bairro' => 'sometimes|string|max:255',
                'cidade' => 'sometimes|string|max:255',
                'uf' => 'sometimes|string|size:2',
            ]);

            $cadastro->update($dadosValidados);

            return response()->json([
                'mensagem' => 'Cadastro atualizado com sucesso!',
                'dados' => $cadastro
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'erro' => 'Erro de validação.',
                'detalhes' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'erro' => 'Erro ao atualizar o cadastro.',
                'detalhes' => $e->getMessage()
            ], 500);
        }
    }

    // Endpoint de exclusão
    public function destroy($id)
    {
        try {
            $cadastro = Cadastro::find($id);

            if (!$cadastro) {
                return response()->json(['mensagem' => 'Cadastro não encontrado.'], 404);
            }

            $cadastro->delete();

            return response()->json(['mensagem' => 'Cadastro excluído com sucesso!'], 200);
        } catch (Exception $e) {
            return response()->json([
                'erro' => 'Erro ao excluir o cadastro.',
                'detalhes' => $e->getMessage()
            ], 500);
        }
    }
}

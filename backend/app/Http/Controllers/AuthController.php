<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Jwt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $token = Jwt::encode([
            'sub' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'exp' => now()->addHours(8)->timestamp,
        ]);

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $payload = $request->attributes->get('jwt_user');

        return response()->json(['user' => $payload]);
    }
}

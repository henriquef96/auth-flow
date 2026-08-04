<?php

namespace App\Http\Middleware;

use App\Support\Jwt;
use Closure;
use Illuminate\Http\Request;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return response()->json(['message' => 'Token ausente.'], 401);
        }

        $token = substr($header, 7);
        $payload = Jwt::decode($token);

        if (!$payload) {
            return response()->json(['message' => 'Token inválido.'], 401);
        }

        $request->attributes->set('jwt_user', $payload);

        return $next($request);
    }
}

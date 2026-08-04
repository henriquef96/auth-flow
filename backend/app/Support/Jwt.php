<?php

namespace App\Support;

use DateTimeImmutable;

class Jwt
{
    public static function encode(array $payload): string
    {
        $header = self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $body = self::base64UrlEncode(json_encode($payload));
        $signature = self::sign($header . '.' . $body);

        return $header . '.' . $body . '.' . $signature;
    }

    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;

        if (!hash_equals($signature, self::sign($header . '.' . $payload))) {
            return null;
        }

        $decoded = json_decode(self::base64UrlDecode($payload), true);

        if (!$decoded || ($decoded['exp'] ?? 0) < (new DateTimeImmutable('now'))->getTimestamp()) {
            return null;
        }

        return $decoded;
    }

    private static function sign(string $input): string
    {
        return self::base64UrlEncode(hash_hmac('sha256', $input, env('JWT_SECRET', 'authflow-secret'), true));
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (strlen($data) + 3) % 4));
    }
}

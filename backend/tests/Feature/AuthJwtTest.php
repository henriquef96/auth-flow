<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthJwtTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_access_protected_routes(): void
    {
        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@authflow.test',
            'password' => 'admin@test',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'admin@test',
        ]);

        $response->assertOk();
        $token = $response->json('token');
        $this->assertNotEmpty($token);

        $meResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/me');

        $meResponse->assertOk()
            ->assertJsonPath('user.email', $user->email);
    }

    public function test_protected_routes_require_a_valid_token(): void
    {
        $this->getJson('/api/cadastros')->assertStatus(401);
    }
}

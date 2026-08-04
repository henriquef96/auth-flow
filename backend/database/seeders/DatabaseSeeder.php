<?php

namespace Database\Seeders;

use App\Models\Cadastro;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Cadastro::factory()->count(10)->create();
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@authflow.test',
            'password' => Hash::make('admin@test'),
        ]);

    }
}

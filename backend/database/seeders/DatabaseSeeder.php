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
        if (!Cadastro::exists()) {
            Cadastro::factory()
                ->count(10)
                ->create();
        }

        User::firstOrCreate(
            [
                'email' => 'admin@authflow.test',
            ],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin@test'),
            ]
        );
    }
}

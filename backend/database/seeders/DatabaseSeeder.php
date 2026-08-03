<?php

namespace Database\Seeders;

use App\Models\Cadastro;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Cadastro::factory()->count(10)->create();
    }
}

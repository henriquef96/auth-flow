<?php

namespace Database\Factories;

use App\Models\Cadastro;
use Illuminate\Database\Eloquent\Factories\Factory;

class CadastroFactory extends Factory
{
    /**
     * O nome do model correspondente à factory.
     *
     * @var string
     */
    protected $model = Cadastro::class;

    public function definition(): array
    {
        return [
            'nome' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'cep' => $this->faker->postcode(),
            'logradouro' => $this->faker->streetName(),
            'numero' => $this->faker->buildingNumber(),
            'complemento' => $this->faker->optional()->secondaryAddress(),
            'bairro' => $this->faker->word(),
            'cidade' => $this->faker->city(),
            'uf' => $this->faker->stateAbbr(),
        ];
    }
}

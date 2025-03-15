<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Contact;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define o modelo correspondente.
     *
     * @var string
     */
    protected $model = Contact::class;

    /**
     * Define o estado padrão do modelo.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'phone' => fake()->regexify('\(0[1-9]{2}\) 9[0-9]{4}-[0-9]{4}'), // Formato (XX) 9XXXX-XXXX
            'email' => fake()->unique()->safeEmail(),
            'notes' => fake()->optional()->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null, 
        ];
    }

    /**
     * Define um estado para contato deletado.
     */
    public function deleted()
    {
        return $this->state(fn (array $attributes) => [
            'deleted_at' => now(),
        ]);
    }
}

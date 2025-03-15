<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;
use App\Models\User;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Criar usuários fictícios e contatos para cada um
        User::factory(5)->create()->each(function ($user) {
            Contact::factory(10)->create(['user_id' => $user->id]);
        });
    }
}

<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService
{
    /**
     * Encontrar um usuário pelo e-mail.
     *
     * @param string $email
     * @return User|null
     */
    public function findUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Atualizar a senha de um usuário.
     *
     * @param User $user
     * @param string $newPassword
     * @return bool
     */
    public function updatePassword(User $user, string $newPassword): bool
    {
        $user->password = Hash::make($newPassword);
        $user->recuperationCode = null;
        return $user->save();
    }

    /**
     * Salva um novo usuário
     *
     * @param User $user
     * @return bool
     */
    public function saveUser(User $user): bool
    {
        $user->password = Hash::make($user->password); // 🔑 Criptografa a senha
        $user->email_verified_at = now();
        $user->remember_token = Str::random(10);

        return $user->save();
    }
}
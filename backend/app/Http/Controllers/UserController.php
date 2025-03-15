<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function updatePassword(Request $request, $email)
    {
        $validator = Validator::make($request->all(), [
            "password" => "required|string|min:6",
        ]);

        if ($validator->fails()) {
            return response()->json(["message" => "A senha deve conter no mínimo 6 caracteres."], 422);
        }

        $loggedInUser = Auth::user();

        if ($loggedInUser->email !== $email) {
            return response()->json(["message" => "Forbiden"], 403);
        }

        $user = $this->userService->findUserByEmail($email);

        if (!$user) {
            return response()->json(["message" => "Usuário não encontrado."], 404);
        }

        if ($this->userService->updatePassword($user, $request->password)) {
            return response()->json(["message" => "Senha atualizada com sucesso."], 200);
        }

        return response()->json(["message" => "Erro ao atualizar a senha."], 500);
    }


    public function saveUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|min:3",
            "email" => "required|email",
            "password" => "required|string|min:6",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = $this->userService->findUserByEmail($request->email);

        if ($user) {
            return response()->json(["message" => "Esse email já está cadastrado."], 409);
        }

        $user = User::create($request->only(["name", "email", "password", "role"]));

        if ($this->userService->saveUser($user)) {
            return response()->json(["message" => "Usuário cadastrado com sucesso."], 201);
        }

        return response()->json(["message" => "Erro ao cadastar usuário"], 500);
    }
}

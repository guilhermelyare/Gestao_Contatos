<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Contact;
use App\Services\ContactService;

class ContactController extends Controller
{
    protected $contactService;

    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }

    // Listar contatos do usuário autenticado (com filtros)
    public function index(Request $request)
    {
        $user = Auth::user();

        $contacts = $this->contactService->getUserContacts($user->id, $request->filter, $request->search);

        return response()->json($contacts);
    }

    // Criar um novo contato
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "phone" => ['required', 'regex:/^\(\d{2}\) \d{4,5}-\d{4}$/'],
            "email" => "required|email|max:255",
            "notes" => "nullable|string",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();

        $contact = Contact::create([
            "user_id" => $user->id,
            "name" => $request->name,
            "phone" => $request->phone,
            "email" => $request->email,
            "notes" => $request->notes,
        ]);

        return response()->json(["message" => "Contato criado com sucesso."], 201);
    }

    // Exibir um contato específico do usuário autenticado
    public function show($id)
    {
        $user = Auth::user();
        $contact = $this->contactService->findUserContactById($user->id, $id);

        if (!$contact) {
            return response()->json(["message" => "Contato não encontrado."], 404);
        }

        return response()->json($contact);
    }

    // Atualizar um contato
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $contact = $this->contactService->findUserContactById($user->id, $id);

        if (!$contact) {
            return response()->json(["message" => "Contato não encontrado."], 404);
        }

        $validator = Validator::make($request->all(), [
            "name" => "sometimes|string|max:255",
            "phone" => ['sometimes', 'regex:/^\(\d{2}\) \d{4,5}-\d{4}$/'],
            "email" => "sometimes|email|max:255",
            "notes" => "nullable|string",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $contact->update($request->all());

        return response()->json(["message" => "Contato atualizado com sucesso."]);
    }

    // Excluir (soft delete) um contato
    public function destroy($id)
    {
        $user = Auth::user();
        $contact = $this->contactService->findUserContactById($user->id, $id);

        if (!$contact) {
            return response()->json(["message" => "Contato não encontrado."], 404);
        }

        $contact->delete();

        return response()->json(["message" => "Contato excluído com sucesso."]);
    }

    // Restaurar um contato apagado
    public function restore($id)
    {
        $user = Auth::user();
        $contact = Contact::onlyTrashed()->where("user_id", $user->id)->find($id);

        if (!$contact) {
            return response()->json(["message" => "Contato não encontrado ou já ativo."], 404);
        }

        $contact->restore();

        return response()->json(["message" => "Contato restaurado com sucesso."]);
    }

    // Exportar contatos para CSV
    public function export()
    {
        $user = Auth::user();
        $contacts = Contact::where("user_id", $user->id)->get();

        $csvData = "Nome,Telefone,Email,Observações\n";
        foreach ($contacts as $contact) {
            $csvData .= "{$contact->name},{$contact->phone},{$contact->email},{$contact->notes}\n";
        }

        return response($csvData)
            ->header("Content-Type", "text/csv")
            ->header("Content-Disposition", 'attachment; filename="contatos.csv"');
    }
}

<?php

namespace App\Services;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;

class ContactService
{
    /**
     * Obtém os contatos do usuário autenticado, com filtros opcionais.
     */
    public function getUserContacts(int $userId, ?string $filter = null, ?string $search = null): Collection
    {
        $query = Contact::withTrashed()->where('user_id', $userId);

        if ($filter) {
            $query->where('name', 'like', "%$filter%")
                  ->orWhere('email', 'like', "%$filter%")
                  ->orWhere('phone', 'like', "%$filter%");
        }

        if ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('phone', 'like', "%$search%");
        }

        return $query->get();
    }

    /**
     * Busca um contato específico do usuário autenticado.
     */
    public function findUserContactById(int $userId, int $contactId): ?Contact
    {
        return Contact::where('user_id', $userId)->find($contactId);
    }

    /**
     * Cria um novo contato para o usuário autenticado.
     */
    public function createContact(array $data): Contact
    {
        return Contact::create($data);
    }

    /**
     * Atualiza os dados de um contato específico do usuário autenticado.
     */
    public function updateContact(Contact $contact, array $data): bool
    {
        return $contact->update($data);
    }

    /**
     * Remove (soft delete) um contato.
     */
    public function deleteContact(Contact $contact): bool
    {
        return $contact->delete();
    }

    /**
     * Restaura um contato deletado.
     */
    public function restoreContact(int $userId, int $contactId): ?Contact
    {
        $contact = Contact::onlyTrashed()->where('user_id', $userId)->find($contactId);
        if ($contact) {
            $contact->restore();
        }
        return $contact;
    }
}

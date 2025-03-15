import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = 'http://127.0.0.1:8000/api/users/saveUser';

  constructor(private httpClient: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, { name, email, password }).pipe(
      catchError(error => {
        let errorMessage = 'Erro ao cadastrar usuário';

        if (error.error?.message) {
          errorMessage = error.error.message; 
        } else if (error.status === 409) {
          errorMessage = 'Este e-mail já está cadastrado.';
        } else if (error.status === 422) {
          errorMessage = 'Dados inválidos. Verifique os campos.';
        } else if (error.status === 0) {
          errorMessage = 'Falha na conexão com o servidor.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

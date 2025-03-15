import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/login';

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          sessionStorage.setItem("auth-token", response.token);
        }
      }),
      catchError(error => {
        let errorMessage = 'Erro desconhecido';

        if (error.error?.error) {
          errorMessage = error.error.error; // Pega a mensagem retornada pela API
        } else if (error.status === 401) {
          errorMessage = 'Credenciais inválidas';
        } else if (error.status === 0) {
          errorMessage = 'Falha na conexão com o servidor';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

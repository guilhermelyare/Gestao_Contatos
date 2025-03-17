import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap, catchError, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://gestaocontatos.eastus2.cloudapp.azure.com:8000/api/auth/';

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "login", { email, password }).pipe(
      tap((response) => {
        if (response && response.access_token) {
          sessionStorage.setItem("auth-token", response.access_token);
        }
      }),
      catchError(error => {
        let errorMessage = 'Erro desconhecido';

        if (error.error?.error) {
          errorMessage = error.error.error;
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

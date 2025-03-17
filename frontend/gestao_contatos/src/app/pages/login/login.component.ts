import { Component } from '@angular/core';
import { LayoutAutenticacaoComponent } from '../../components/layout-autenticacao/layout-autenticacao.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthInputComponent } from '../../components/auth-input/auth-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LayoutAutenticacaoComponent,
    ReactiveFormsModule,
    AuthInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup<LoginForm>;
  isLoading = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.toastService.warning('Preencha todos os campos corretamente.');
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.getRawValue(); // 🔹 Garante que os valores sejam `string`

    this.loginService.login(email, password).subscribe({
      next: () => {
        this.toastService.success('Login feito com sucesso!');
        this.router.navigate(['/contatos']);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err?.error?.message || 'Erro inesperado! Tente novamente mais tarde';
        this.toastService.error(errorMessage);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navigate() {
    this.router.navigate(['signup']);
  }
}

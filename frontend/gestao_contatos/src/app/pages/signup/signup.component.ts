import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutAutenticacaoComponent } from '../../components/layout-autenticacao/layout-autenticacao.component';
import { AuthInputComponent } from '../../components/auth-input/auth-input.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SignupService } from '../../services/signup.service';

interface SignupForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    LayoutAutenticacaoComponent,
    ReactiveFormsModule,
    AuthInputComponent
  ],  
  providers: [SignupService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignUpComponent {
  signupForm: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private signupService: SignupService,
    private toastService: ToastrService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      passwordConfirm: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
    });
  }

  submit() {
    if (this.signupForm.invalid) {
      this.toastService.error('Preencha todos os campos corretamente.');
      return;
    }
  
    const name = this.signupForm.get('name')!.value;
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    const passwordConfirm = this.signupForm.get('passwordConfirm')!.value;
  
    if (password !== passwordConfirm) {
      this.toastService.error('As senhas não coincidem.');
      return;
    }
  
    this.signupService.signup(name, email, password).subscribe({
      next: () => {
        this.toastService.success('Cadastro realizado com sucesso!');
        this.router.navigate(['login']);
      },
      error: (error) => {
        this.toastService.error(error.message);
      }
    });
  }
  

  navigate() {
    this.router.navigate(['login']);
  }
}

import { Component } from '@angular/core';
import { LayoutAutenticacaoComponent } from '../../components/layout-autenticacao/layout-autenticacao.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LayoutAutenticacaoComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}

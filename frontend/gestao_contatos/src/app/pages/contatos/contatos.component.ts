import { Component } from '@angular/core';
import { ContactDataComponent } from '../../components/contact-data/contact-data.component';
import { ListComponent } from '../../components/list/list.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [
    ContactDataComponent,
    ListComponent
  ],
  templateUrl: './contatos.component.html',
  styleUrl: './contatos.component.scss'
})
export class ContatosComponent {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {}

  onLogout(): void {
    sessionStorage.removeItem("auth-token");

    this.toastr.success('Você saiu com sucesso!', 'Logout');
        
    this.router.navigate(['/']);
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../types/contact.type';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-data.component.html',
  styleUrl: './contact-data.component.scss'
})
export class ContactDataComponent {
  @Input() contact: Contact | null = null;
  @Output() contactSelected = new EventEmitter<Contact | null>();

  constructor(
    private contactService: ContactService,
    private toastService: ToastrService,
    private router: Router,
  ) {}

  deselectContact() {
    this.contactSelected.emit(null);
  }

  deleteContact(contactId: number) {
    this.contactService.deleteContact(contactId).subscribe(
      () => {
        this.toastService.success('Contato excluido com sucesso!');
        this.router.navigate(['/contatos']).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        this.toastService.error('Erro ao excluir contato. Tente novamente mais tarde.');
        console.error(error);
      }
    );
  }
}

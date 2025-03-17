import { Component, OnInit } from '@angular/core';
import { AuthInputComponent } from '../auth-input/auth-input.component';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { ContactDataComponent } from '../contact-data/contact-data.component';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../types/contact.type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    FormsModule,
    AuthInputComponent,
    ContactListComponent,
    ContactDataComponent,
    AddContactComponent,
    CommonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [ContactService]
})
export class ListComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContact: Contact | null = null;
  searchTerm: string = '';
  showAddContact: boolean = false;
  currentFilter: string = 'nao-apagados';

  constructor(
    private contactService: ContactService,
    private router: Router,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.applyFilter(); 
        this.toastService.success('Contatos carregados com sucesso!'); 
      },
      error: (err) => {
        console.error('Erro ao buscar contatos:', err);
        this.router.navigate(['/']);
      }
    });
  }

  applyFilter() {
    switch (this.currentFilter) {
      case 'todos':
        this.filteredContacts = this.contacts;
        break;
      case 'nao-apagados':
        this.filteredContacts = this.contacts.filter(contact => contact.deleted_at === null);
        break;
      case 'apagados':
        this.filteredContacts = this.contacts.filter(contact => contact.deleted_at !== null);
        break;
      default:
        this.filteredContacts = this.contacts;
    }
    this.filterContacts();
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilter();
  }

  onSelectContact(contact: Contact | null) {
    this.selectedContact = contact;
    this.showAddContact = false;
  }

  get contactNames(): string[] {
    return this.filteredContacts.map(contact => contact.name);
  }

  filterContacts() {
    this.filteredContacts = this.filteredContacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onAddContact() {
    this.showAddContact = true;
  }

  onCancelAddContact() {
    this.showAddContact = false;
    this.selectedContact = null;
    this.loadContacts();
  }

  onExport() {
    this.contactService.exportContacts().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'contatos.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.toastService.error('Erro ao exportar contatos.');
        console.error('Erro ao exportar contatos:', err);
      }
    });
  }
}

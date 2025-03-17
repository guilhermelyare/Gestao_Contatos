import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../types/contact.type';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  @Input() names: string[] = [];
  @Input() contacts: Contact[] = [];
  @Output() contactSelected = new EventEmitter<Contact>();

  selectContact(contact: Contact) {
    this.contactSelected.emit(contact);
  }
}

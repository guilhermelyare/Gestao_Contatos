import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthInputComponent } from '../auth-input/auth-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { Router } from '@angular/router';
import { Contact } from '../../types/contact.type';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    AuthInputComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent implements OnInit {
  contactForm!: FormGroup;
  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      descricao: ['']
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.toastService.warning('Preencha todos os campos corretamente.'); 
      return;
    }

    const newContact: Contact = {
      id: 0,
      name: this.contactForm.value.name,
      phone: this.contactForm.value.telefone,
      email: this.contactForm.value.email,
      notes: this.contactForm.value.descricao,
      deleted_at: null,
    };

    this.contactService.createContact(newContact).subscribe(
      response => {
        console.log('Contato criado com sucesso', response);
        this.toastService.success('Contato criado com sucesso!');
        this.router.navigate(['/contacts']);
        this.cancel.emit(); 
      },
      error => {
        console.error('Erro ao criar contato', error);
        this.toastService.error('Erro ao criar contato. Tente novamente mais tarde.');
      }
    );
  }

  onCancel() {
    this.cancel.emit();
  }
}

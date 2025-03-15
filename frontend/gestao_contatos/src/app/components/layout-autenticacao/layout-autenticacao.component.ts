import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-layout-autenticacao',
  standalone: true,
  imports: [],
  templateUrl: './layout-autenticacao.component.html',
  styleUrl: './layout-autenticacao.component.scss'
})
export class LayoutAutenticacaoComponent {
  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";
  @Input() disablePrimaryBtn: boolean = true;
  @Output("submit") onSubmit = new EventEmitter();

  @Output("navigate") onNavigate = new EventEmitter();
  
  submit(){
    this.onSubmit.emit();
  }

  navigate(){
    this.onNavigate.emit();
  }
}

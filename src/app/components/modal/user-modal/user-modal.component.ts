import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {
  @Output() addUsuario = new EventEmitter<any>();
  @Input() selectedUsuario: any;

  userForm: FormGroup;
  showPassword: boolean = false;
  passwordsMatch: boolean = true;
  submitted: boolean = false;

  tiposUsuarios: { value: string; label: string }[] = [
    { value: 'COMISSARIO_GERAL', label: 'Comissário Geral' },
    { value: 'COMISSARIO_CHEFE_2CGPN', label: 'Comissário Chefe/2º CGPN' },
    { value: 'COMISSARIO_CHEFE', label: 'Comissário Chefe' },
    { value: 'COMISSARIO', label: 'Comissário' },
    { value: 'SUB_COMISSARIO', label: 'Sub-Comissário' },
    { value: 'SUPERINTENDENTE_CHEFE', label: 'Superintendente Chefe' },
    { value: 'SUPERINTENDENTE', label: 'Superintendente' },
    { value: 'INTENDENTE', label: 'Intendente' },
    { value: 'INSPECTOR_CHEFE', label: 'Inspector Chefe' },
    { value: 'INSPECTOR', label: 'Inspector' },
    { value: 'SUBINSPECTOR', label: 'Subinspector' },
    { value: 'PRIMEIRO_SUBCHEFE', label: '1.º Subchefe' },
    { value: 'SEGUNDO_SUBCHEFE', label: '2.º Subchefe' },
    { value: 'TERCEIRO_SUBCHEFE', label: '3.º Subchefe' },
    { value: 'AGENTE_PRIMEIRA_CLASSE', label: 'Agente de 1.ª Classe' },
    { value: 'AGENTE_SEGUNDA_CLASSE', label: 'Agente de 2.ª Classe' },
    { value: 'AGENTE_TERCEIRA_CLASSE', label: 'Agente de 3.ª Classe' },
    { value: 'ALISTADO', label: 'Alistado' }
  ];

   constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      login: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      code:['', Validators.required],
      bi: ['', ],
      phone:['', ]
    });

    this.userForm.valueChanges.subscribe(() => {
      this.passwordsMatch = this.userForm.get('password')?.value === this.userForm.get('confirmPassword')?.value;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedUsuario) {
      this.userForm.patchValue(this.selectedUsuario);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getInitials(nome: string): string {
    if (!nome) return '';

    const nomeParts = nome.trim().split(' ');

    if (nomeParts.length === 1) {
      return nomeParts[0];
    }

    const firstnome = nomeParts[0];
    const lastnome = nomeParts[nomeParts.length - 1];
    const initials = firstnome[0].toUpperCase() + (lastnome ? lastnome[0].toUpperCase() : '');

    return initials;
  }
  
  onSubmit(): void {
    this.submitted = false;
 
    if (this.userForm.valid && this.passwordsMatch) {
      this.addUsuario.emit(this.userForm.value)
      this.userForm.reset();
    }

  }
}

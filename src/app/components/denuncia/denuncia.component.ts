import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.component.html',
  styleUrls: ['./denuncia.component.scss']
})
export class DenunciaComponent {

  registroForm: FormGroup;
  @Output() goList = new EventEmitter<any>();
  @Output() addRegistos = new EventEmitter<any>();
  @Input() selectedRegistos: any;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      identificacao: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      email: ['', ],
      tipo: ['Queixa', [Validators.required]],
      data: ['', [Validators.required]],
      local: ['', [Validators.required]],
      descricao: ['', [Validators.required, Validators.minLength(10)]]
    });
  }


  onSubmit(){
    this.addRegistos.emit(this.registroForm.value);
    this.gerarPDF();
   
  }

  listComponent() {
    this.goList.emit();
   }
  gerarPDF() {
    if (this.registroForm.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const { nome, identificacao, telefone, email, tipo, data, local, descricao } = this.registroForm.value;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Registro de Queixa ou Participação', 10, 10);
    doc.setFontSize(12);
    doc.text(`Nome Completo: ${nome}`, 10, 30);
    doc.text(`Número do BI/Passaporte: ${identificacao}`, 10, 40);
    doc.text(`Telefone: ${telefone}`, 10, 50);
    doc.text(`E-mail: ${email || 'N/A'}`, 10, 60);
    doc.text(`Tipo de Registro: ${tipo}`, 10, 70);
    doc.text(`Data do Incidente: ${data}`, 10, 80);
    doc.text(`Local do Incidente: ${local}`, 10, 90);
    doc.text('Descrição do Incidente:', 10, 100);
    doc.text(descricao, 10, 110, { maxWidth: 190 });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text('Documento gerado automaticamente.', 105, pageHeight - 20, { align: 'center' });
    doc.text('© Polícia Nacional de Angola', 105, pageHeight - 10, { align: 'center' });


    doc.save('registro_queixa_participacao.pdf');
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { CriminalService } from '../../services/criminal.service';
import { Complaint, Testemunha } from '../../models/complaint.model';
import { Criminal } from '../../models/criminal.model';

@Component({
  selector: 'app-register-complaint',
  templateUrl: './register-complaint.component.html',
  styleUrls: ['./register-complaint.component.scss']
})
export class RegisterComplaintComponent implements OnInit {
  complaintForm!: FormGroup;
  existingCriminal: Criminal | null = null;
  criminalSearchPerformed = false;
  isSearching = false;
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'warning' | 'error' = 'success';

  tiposCrime = [
    'Furto', 'Roubo', 'Agressão', 'Homicídio', 'Violação', 'Sequestro',
    'Burla', 'Corrupção', 'Tráfico de Droga', 'Violência Doméstica',
    'Vandalismo', 'Fraude', 'Extorsão', 'Outro'
  ];

  provincias = [
    'Luanda', 'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
    'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 'Namibe',
    'Uíge', 'Zaire'
  ];

  estadosCivis = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União de Facto'];

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private criminalService: CriminalService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm(): void {
    this.complaintForm = this.fb.group({
      tipoCrime: ['', Validators.required],
      denunciante: this.fb.group({
        nome: ['', Validators.required],
        bi: ['', Validators.required],
        telefone: ['', Validators.required],
        endereco: ['', Validators.required],
        email: [''],
        profissao: [''],
        relacaoSuspeito: ['', Validators.required]
      }),
      suspeito: this.fb.group({
        nome: ['', Validators.required],
        apelido: [''],
        bi: [''],
        idade: [''],
        genero: [''],
        descricaoFisica: ['', Validators.required],
        endereco: [''],
        profissao: [''],
        antecedentesConhecidos: [false]
      }),
      ocorrencia: this.fb.group({
        data: ['', Validators.required],
        hora: ['', Validators.required],
        local: ['', Validators.required],
        provincia: ['', Validators.required],
        municipio: ['', Validators.required],
        descricao: ['', Validators.required]
      }),
      testemunhas: this.fb.array([]),
      observacoes: ['']
    });
  }

  get testemunhas(): FormArray {
    return this.complaintForm.get('testemunhas') as FormArray;
  }

  addTestemunha(): void {
    const testemunhaForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      relato: ['', Validators.required]
    });
    this.testemunhas.push(testemunhaForm);
  }

  removeTestemunha(index: number): void {
    this.testemunhas.removeAt(index);
  }

  searchCriminal(): void {
    const suspeitoData = this.complaintForm.get('suspeito')?.value;
    
    if (!suspeitoData.nome && !suspeitoData.bi && !suspeitoData.apelido) {
      this.showAlertMessage('Por favor, insira o nome, BI ou alcunha do suspeito para pesquisar.', 'warning');
      return;
    }

    this.isSearching = true;
    const searchQuery = suspeitoData.nome || suspeitoData.bi || suspeitoData.apelido;

    this.criminalService.searchCriminals(searchQuery).subscribe({
      next: (criminals) => {
        this.isSearching = false;
        this.criminalSearchPerformed = true;
        
        if (criminals.length > 0) {
          this.existingCriminal = criminals[0];
          this.showAlertMessage(
            `⚠️ ALERTA: Criminoso encontrado no sistema! ${this.existingCriminal.nome} tem ${this.existingCriminal.crimes.length} crime(s) registrado(s). Nível de periculosidade: ${this.existingCriminal.nivelPericulosidade}`,
            'warning'
          );
          
          // Auto-fill form with existing data
          this.complaintForm.patchValue({
            suspeito: {
              nome: this.existingCriminal.nome,
              apelido: this.existingCriminal.apelido,
              bi: this.existingCriminal.bi,
              idade: this.existingCriminal.idade,
              genero: this.existingCriminal.genero,
              endereco: this.existingCriminal.endereco,
              profissao: this.existingCriminal.profissao,
              antecedentesConhecidos: true
            }
          });
        } else {
          this.existingCriminal = null;
          this.showAlertMessage('Suspeito não encontrado no sistema. Novo registro será criado.', 'success');
        }
      },
      error: () => {
        this.isSearching = false;
        this.showAlertMessage('Erro ao pesquisar criminoso.', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.complaintForm.valid) {
      const formData = this.complaintForm.value;
      
      const complaint: Complaint = {
        id: '',
        numeroProcesso: '',
        dataRegistro: '',
        status: 'Aberta',
        tipoCrime: formData.tipoCrime,
        denunciante: formData.denunciante,
        suspeito: {
          ...formData.suspeito,
          criminalExistente: !!this.existingCriminal,
          criminalId: this.existingCriminal?.id
        },
        ocorrencia: {
          ...formData.ocorrencia,
          testemunhas: formData.testemunhas || [],
          evidencias: []
        },
        observacoes: formData.observacoes || '',
        anexos: []
      };

      this.complaintService.addComplaint(complaint).subscribe({
        next: (savedComplaint) => {
          this.showAlertMessage(
            `Queixa registrada com sucesso! Número do processo: ${savedComplaint.numeroProcesso}`,
            'success'
          );
          this.resetForm();
        },
        error: () => {
          this.showAlertMessage('Erro ao registrar queixa.', 'error');
        }
      });
    } else {
      this.showAlertMessage('Por favor, preencha todos os campos obrigatórios.', 'warning');
    }
  }

  resetForm(): void {
    this.complaintForm.reset();
    this.initForm();
    this.existingCriminal = null;
    this.criminalSearchPerformed = false;
  }

  private showAlertMessage(message: string, type: 'success' | 'warning' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}

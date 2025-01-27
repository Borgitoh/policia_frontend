import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-criminal-record',
  templateUrl: './criminal-record.component.html',
  styleUrls: ['./criminal-record.component.scss']
})
export class CriminalRecordComponent {
   // Formulário reativo principal
   criminalForm!: FormGroup;
   @Output() goList = new EventEmitter<any>();

   // Webcam
   @ViewChild('webcam') webcam!: ElementRef<HTMLVideoElement>;
   @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
   fotoCapturada: string | null = null;
   maiorDeIdade: boolean = true;

   tiposCrime: { value: string; label: string }[] = [
    { value: 'CRIME_CONTRA_PESSOA', label: 'Crimes Contra a Pessoa' },
    { value: 'CRIME_CONTRA_PATRIMONIO', label: 'Crimes Contra o Patrimônio' },
    { value: 'CRIME_CONTRA_ADMINISTRACAO_PUBLICA', label: 'Crimes Contra a Administração Pública' },
    { value: 'CRIME_CONTRA_ORDEM_ECONOMICA', label: 'Crimes Contra a Ordem Econômica e Tributária' },
    { value: 'CRIME_CONTRA_HONRA', label: 'Crimes Contra a Honra' },
    { value: 'CRIME_CIBERNETICO', label: 'Crimes Cibernéticos' },
    { value: 'CRIME_CONTRA_SAUDE_PUBLICA', label: 'Crimes Contra a Saúde Pública' },
    { value: 'CRIME_AMBIENTAL', label: 'Crimes Ambientais' },
    { value: 'CRIME_CONTRA_SEGURANCA_NACIONAL', label: 'Crimes Contra a Segurança Nacional' }];

   constructor(private fb: FormBuilder) {
    this.criminalForm = this.fb.group({
      apelido: ['', Validators.required],
      nome: ['', Validators.required],
      bi: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      descricaoCrime: ['', Validators.required],
      dataCrime: ['', Validators.required],
      historicoCrimes: this.fb.array([]),
      foto: [''],
    });
    this.inicializarWebcam();

    this.criminalForm.get('dataNascimento')?.valueChanges.subscribe((value) => {
      if (value) {
         this.maiorDeIdade = this.verificarMaioridade(value);
      }
    })
   }

   listComponent() {
   this.goList.emit();
  }

   verificarMaioridade(dataNascimento: string): boolean {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();

    const anos = hoje.getFullYear() - nascimento.getFullYear();
    const meses = hoje.getMonth() - nascimento.getMonth();
    const dias = hoje.getDate() - nascimento.getDate();

    // Ajusta anos, meses e dias caso o aniversário ainda não tenha ocorrido no ano atual
    if (meses < 0 || (meses === 0 && dias < 0)) {
      return anos - 1 >= 18; // Se ainda não completou aniversário, ajusta para um ano a menos
    }

    return anos >= 18;
  }

   // Getter para acessar o array de crimes
   get historicoCrimes(): FormArray {
     return this.criminalForm.get('historicoCrimes') as FormArray;
   }

   // Adicionar crime ao histórico
   adicionarCrime(): void {
    const { descricaoCrime, dataCrime } = this.criminalForm.value;
    const crimeForm = this.fb.group({
      descricaoCrime: [descricaoCrime, Validators.required],
      dataCrime: [dataCrime, Validators.required],
    });

    this.historicoCrimes.push(crimeForm);

    this.criminalForm.patchValue({
      descricaoCrime: '',
      dataCrime: '',
    });
  }

   // Remover crime do histórico
   removerCrime(index: number): void {
     this.historicoCrimes.removeAt(index);
   }

   // Inicializar webcam
   inicializarWebcam(): void {
     navigator.mediaDevices
       .getUserMedia({ video: true })
       .then((stream) => {
         this.webcam.nativeElement.srcObject = stream;
       })
       .catch((err) => {
         console.error('Erro ao acessar a webcam:', err);
       });
   }
   capturarFoto(): void {
     const canvas = this.canvas.nativeElement;
     const context = canvas.getContext('2d');
     const video = this.webcam.nativeElement;

     if (context) {
       canvas.width = video.videoWidth;
       canvas.height = video.videoHeight;
       context.drawImage(video, 0, 0, canvas.width, canvas.height);
       this.fotoCapturada = canvas.toDataURL('image/png'); // Convertendo a imagem para base64
       this.criminalForm.patchValue({ foto: this.fotoCapturada });
     }
   }

   // Submeter formulário
   enviarFormulario(): void {
     if (this.criminalForm.valid) {
       console.log('Dados enviados:', this.criminalForm.value);
     } else {
       console.error('Formulário inválido!');
     }
   }

   imprimirFicha() {
    const fichaElement = document.getElementById('ficha-criminal');
    if (fichaElement) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write('<html><head><title>Ficha Criminal</title>');
      printWindow?.document.write(' <script src="https://cdn.tailwindcss.com"></script>');
      printWindow?.document.write('</head><body>');
      printWindow?.document.write(fichaElement.innerHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      setTimeout(()=>{
        printWindow?.print();
    }, 1000);

    }
  }
}

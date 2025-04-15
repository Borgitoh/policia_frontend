import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebcamSnapshotComponent } from '../webcam-snapshot/webcam-snapshot.component';
import { CriminalsService } from 'src/app/service/criminals.service';

@Component({
  selector: 'app-criminal-record',
  templateUrl: './criminal-record.component.html',
  styleUrls: ['./criminal-record.component.scss']
})
export class CriminalRecordComponent {
   // Formulário reativo principal
   criminalForm!: FormGroup;
   @Output() goList = new EventEmitter<any>();
   @Input() selectedUsuario: any ;
   @ViewChild('webcam') webcam!: ElementRef<HTMLVideoElement>;
   @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
   @ViewChild(WebcamSnapshotComponent) webcamSnapshotComponent!: WebcamSnapshotComponent;

   fotoCapturada: string | null = null;
   maiorDeIdade: boolean = true;
   dropdownOpen = false;
   selectedCrimes: { value: string; label: string }[] = [];
   dados:any  = ''

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

   constructor(private fb: FormBuilder,
               private criminalsService : CriminalsService) {
    this.criminalForm = this.fb.group({
      apelido: ['', Validators.required],
      nome: ['', Validators.required],
      bi: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      descricaoCrime: ['', Validators.required],
      dataCrime: [''],
      tipoCrime:[[],Validators.required],
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

   ngOnChanges(changes: SimpleChanges): void {
      if (this.selectedUsuario) {
        this.criminalForm.patchValue(this.selectedUsuario);
        this.adicionarCrime(this.selectedUsuario.historicoCrimes[0]);
      }
    }

   toggleTipoCrime(value:any) {
    if (this.selectedCrimes.includes(value)) {
      this.selectedCrimes = this.selectedCrimes.filter(crime => crime !== value);
    } else {
      this.selectedCrimes.push(value);
     this.dados += value.label+ ', '
    }
  }
  isSelected(value: string): boolean {
    return this.selectedCrimes.some(crime => crime.value === value);
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  verificarMaioridade(dataNascimento: string): boolean {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();

    const anos = hoje.getFullYear() - nascimento.getFullYear();
    const meses = hoje.getMonth() - nascimento.getMonth();
    const dias = hoje.getDate() - nascimento.getDate();

    if (meses < 0 || (meses === 0 && dias < 0)) {
      return anos - 1 >= 18; 
    }
    return anos >= 18;
  }

  get historicoCrimes(): FormArray {
     return this.criminalForm.get('historicoCrimes') as FormArray;
   }
   adicionarCrime(items?:any): void {
    if(items){
      const crimeForm = this.fb.group({
        tipoCrime: [items.tipoCrime, Validators.required],
        dataCrime: [items.dataCrime, Validators.required],
      });
      this.historicoCrimes.push(crimeForm);
    }else{
      this.criminalForm.get('tipoCrime')?.setValue( this.selectedCrimes)
      const { tipoCrime, dataCrime } = this.criminalForm.value;
      const crimeForm = this.fb.group({
        tipoCrime: [tipoCrime, Validators.required],
        dataCrime: [dataCrime, Validators.required],
      });
      this.historicoCrimes.push(crimeForm);
    }
  }

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
     if (this.criminalForm.valid && this.webcamSnapshotComponent.captures) {
        this.criminalForm.get('foto')?.setValue(this.webcamSnapshotComponent.captures);
        this.criminalsService.addRegistro(this.criminalForm.value).subscribe(
          (_:any) => {
            
          },
          (error) => {
            console.error('Erro ao usaurio:', error);
          }
        );
       
     } else {
       console.error('Formulário inválido!');
     }
   }
   imprimirFicha() {
    const fichaElement = document.getElementById('ficha-criminal');
    console.log(this.selectedUsuario);
    
    if (fichaElement) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write('<html><head><title>Ficha Criminal</title>');
      printWindow?.document.write(' <script src="https://cdn.tailwindcss.com"></script>');
      printWindow?.document.write('</head><body>');
      let fichaHTML = fichaElement.innerHTML;
      fichaHTML = fichaHTML.replace(/<video[^>]*>.*?<\/video>/s, ``);
      fichaHTML = fichaHTML.replace(/<canvas[^>]*>.*?<\/canvas>/s, `<img src="${this.selectedUsuario.foto[0]}" class="w-80 h-auto border rounded" />`);
      console.log(fichaHTML);
      printWindow?.document.write(fichaHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      setTimeout(()=>{
        printWindow?.print();
    }, 1000);

    }
  }
}

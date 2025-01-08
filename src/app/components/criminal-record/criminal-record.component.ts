import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-criminal-record',
  templateUrl: './criminal-record.component.html',
  styleUrls: ['./criminal-record.component.scss']
})
export class CriminalRecordComponent {
   // Formulário reativo principal
   criminalForm!: FormGroup;

   // Webcam
   @ViewChild('webcam') webcam!: ElementRef<HTMLVideoElement>;
   @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
   fotoCapturada: string | null = null;
   maiorDeIdade: boolean = true;
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

    // Cria um novo crime no formato esperado
    const crimeForm = this.fb.group({
      descricaoCrime: [descricaoCrime, Validators.required],
      dataCrime: [dataCrime, Validators.required],
    });

    // Adiciona ao FormArray
    this.historicoCrimes.push(crimeForm);

    console.log(this.historicoCrimes.value);

    // Opcional: Resete os campos específicos do crime após adicionar
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
 
   // Capturar foto da webcam
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
}

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
 
   constructor(private fb: FormBuilder) {
    this.criminalForm = this.fb.group({
      apelido: ['', Validators.required],
      nome: ['', Validators.required],
      bi: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      historicoCrimes: this.fb.array([]),
      foto: [''],
    });
    this.inicializarWebcam();
   }
 
   // Getter para acessar o array de crimes
   get historicoCrimes(): FormArray {
     return this.criminalForm.get('historicoCrimes') as FormArray;
   }
 
   // Adicionar crime ao histórico
   adicionarCrime(): void {
     const crimeForm = this.fb.group({
       descricao: ['', Validators.required],
       data: ['', Validators.required],
     });
     this.historicoCrimes.push(crimeForm);
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

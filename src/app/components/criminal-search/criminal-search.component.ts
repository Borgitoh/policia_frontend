import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CriminalService } from '../../services/criminal.service';
import { Criminal } from '../../models/criminal.model';

@Component({
  selector: 'app-criminal-search',
  templateUrl: './criminal-search.component.html',
  styleUrls: ['./criminal-search.component.scss']
})
export class CriminalSearchComponent implements OnInit {
  searchQuery = '';
  searchResults: Criminal[] = [];
  selectedCriminal: Criminal | null = null;
  showModal = false;
  isSearching = false;
  hasSearched = false;

  // Face Recognition Properties
  searchMode: 'text' | 'face' = 'text';
  faceSearchPhoto: string | null = null;
  isCameraActive = false;
  isFaceSearching = false;
  hasFaceSearched = false;
  faceSearchResults: Criminal[] = [];
  currentStream: MediaStream | null = null;

  @ViewChild('faceVideo') faceVideo!: ElementRef<HTMLVideoElement>;

  constructor(private criminalService: CriminalService) { }

  ngOnInit(): void { }

  searchCriminals(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.isSearching = true;
    this.criminalService.searchCriminals(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
        this.hasSearched = true;
      },
      error: () => {
        this.isSearching = false;
        this.hasSearched = true;
      }
    });
  }

  viewCriminal(criminal: Criminal): void {
    this.selectedCriminal = criminal;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCriminal = null;
  }

  getPericulosityClass(nivel: string): string {
    switch (nivel) {
      case 'Baixo':
        return 'bg-green-100 text-green-800';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alto':
        return 'bg-orange-100 text-orange-800';
      case 'Extremo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Procurado':
        return 'bg-red-100 text-red-800';
      case 'Detido':
        return 'bg-orange-100 text-orange-800';
      case 'Condenado':
        return 'bg-purple-100 text-purple-800';
      case 'Livre':
        return 'bg-green-100 text-green-800';
      case 'Em Julgamento':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-AO');
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.hasSearched = false;
  }

  onEnterKey(event: any): void {
    if (event.key === 'Enter') {
      this.searchCriminals();
    }
  }

  // Face Recognition Methods
  setSearchMode(mode: 'text' | 'face'): void {
    this.searchMode = mode;
    if (mode === 'text') {
      this.clearFaceSearch();
    } else {
      this.clearSearch();
    }
  }

  async startCamera(): Promise<void> {
    try {
      this.currentStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400 }
      });
      this.faceVideo.nativeElement.srcObject = this.currentStream;
      this.isCameraActive = true;
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  }

  stopCamera(): void {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }
    this.isCameraActive = false;
  }

  captureFromCamera(): void {
    const video = this.faceVideo.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      this.faceSearchPhoto = canvas.toDataURL('image/jpeg', 0.8);
      this.stopCamera();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.faceSearchPhoto = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  searchByFace(): void {
    if (!this.faceSearchPhoto) return;

    this.isFaceSearching = true;
    this.hasFaceSearched = false;

    // Simular análise de reconhecimento facial
    setTimeout(() => {
      this.criminalService.getCriminals().subscribe(criminals => {
        // Simular algoritmo de reconhecimento facial
        // Em um sistema real, isso seria feito por IA/ML
        const matches = this.simulateFaceRecognition(criminals);

        this.faceSearchResults = matches;
        this.searchResults = matches;
        this.hasFaceSearched = true;
        this.isFaceSearching = false;
        this.hasSearched = true;
      });
    }, 2000); // Simular tempo de processamento
  }

  private simulateFaceRecognition(criminals: Criminal[]): Criminal[] {
    // Simular reconhecimento facial - em um sistema real seria feito com IA
    // Por agora, vamos retornar alguns resultados aleatórios para demonstração
    const numberOfMatches = Math.floor(Math.random() * 3); // 0-2 correspondências

    if (numberOfMatches === 0) {
      return [];
    }

    const shuffled = criminals.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfMatches);
  }

  clearFaceSearch(): void {
    this.faceSearchPhoto = null;
    this.faceSearchResults = [];
    this.hasFaceSearched = false;
    this.isFaceSearching = false;
    this.stopCamera();
  }
}

import { Component, OnInit } from '@angular/core';
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
}

import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CriminalsService } from 'src/app/service/criminals.service';

@Component({
  selector: 'app-criminal-list',
  templateUrl: './criminal-list.component.html',
  styleUrls: ['./criminal-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }), 
        animate('300ms ease-in', style({ opacity: 1 })), 
      ]),
      transition(':leave', [ 
        animate('300ms ease-out', style({ opacity: 0 })), 
      ]),
    ]),
  ],
})
export class CriminalListComponent {

  searchTerm: string = '';
  searchTermCargo: string = '';
  filteredUsers: any[] = [];
  dropdownOpen: number | null = null;
  isModalOpen = false;
  selectedUsuario: any = null;

  tiposCrime: { value: string; label: string }[] = [
    { value: 'CRIME_CONTRA_PESSOA', label: 'Crimes Contra a Pessoa' },
    { value: 'CRIME_CONTRA_PATRIMONIO', label: 'Crimes Contra o Patrimônio' },
    { value: 'CRIME_CONTRA_ADMINISTRACAO_PUBLICA', label: 'Crimes Contra a Administração Pública' },
    { value: 'CRIME_CONTRA_ORDEM_ECONOMICA', label: 'Crimes Contra a Ordem Econômica e Tributária' },
    { value: 'CRIME_CONTRA_HONRA', label: 'Crimes Contra a Honra' },
    { value: 'CRIME_CIBERNETICO', label: 'Crimes Cibernéticos' },
    { value: 'CRIME_CONTRA_SAUDE_PUBLICA', label: 'Crimes Contra a Saúde Pública' },
    { value: 'CRIME_AMBIENTAL', label: 'Crimes Ambientais' },
    { value: 'CRIME_CONTRA_SEGURANCA_NACIONAL', label: 'Crimes Contra a Segurança Nacional' }
  ];

    constructor(private criminalsService : CriminalsService) {
      this.getCriminals();
    }

  filterUsers() {
    this.filteredUsers = this.filteredUsers.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterByPerfil() {
    this.filteredUsers = this.filteredUsers.filter(user =>
      user.permission[0].code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goList() {
    this.isModalOpen = false;
    this.selectedUsuario= null
  }

  getCriminals(){
    this.criminalsService.getRegistros().subscribe(
      (data: any) => {
        this.filteredUsers = data
      },
      (error) => {
        console.error('Erro ao usaurio:', error);
      }
    );
  }

  editUsuario(usuario:any) {
    this.selectedUsuario = usuario
    this.isModalOpen = true;
  }

  toggleDropdown(index: number) {
    this.dropdownOpen = this.dropdownOpen === index ? null : index;
  }

  openCrime() {
    this.isModalOpen = !this.isModalOpen;
  }

  getInitials(nome: any) {
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

}

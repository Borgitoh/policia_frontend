import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-criminal-list',
  templateUrl: './criminal-list.component.html',
  styleUrls: ['./criminal-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ // Quando o elemento entra no DOM
        style({ opacity: 0 }), // Começa invisível
        animate('300ms ease-in', style({ opacity: 1 })), // Anima até 100% de opacidade
      ]),
      transition(':leave', [ // Quando o elemento sai do DOM
        animate('300ms ease-out', style({ opacity: 0 })), // Anima até 0% de opacidade
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


    constructor() {

    }

  filterUsers() {
    this.filteredUsers = this.filteredUsers.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterByPerfil() {
    console.log(this.searchTerm)
    this.filteredUsers = this.filteredUsers.filter(user =>
      user.permission[0].code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goList() {
    this.isModalOpen = false;
    this.selectedUsuario= null
  }

  editUsuario(usuario:any) {
    this.selectedUsuario = usuario
    this.selectedUsuario.code = usuario.code
    this.isModalOpen = true;
  }

  toggleDropdown(index: number) {
    this.dropdownOpen = this.dropdownOpen === index ? null : index;
  }

  openCrime() {
    this.isModalOpen = !this.isModalOpen;
  }
  addCrime(usuario:any){

  }

  addUsuario(usuario: any) {
    this.goList();
    if(!this.selectedUsuario){

    }else{

    }

    this.selectedUsuario = null

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

  getFilteredPermissions(permissao: any) {
        return null
  }

}

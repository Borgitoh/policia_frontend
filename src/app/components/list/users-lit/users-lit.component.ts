import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/service/usuario-service.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-lit.component.html',
  styleUrls: ['./users-lit.component.scss']
})
export class UsersLitComponent {

  searchTerm: string = '';
  searchTermCargo: string = '';
  filteredUsers: any[] = [];
  dropdownOpen: number | null = null;
  isModalOpen = false;
  selectedUsuario: any = null;

  tiposUsuarios: { value: string; label: string }[] = [
    { value: 'COMISSARIO_GERAL', label: 'Comissário Geral' },
    { value: 'COMISSARIO_CHEFE_2CGPN', label: 'Comissário Chefe/2º CGPN' },
    { value: 'COMISSARIO_CHEFE', label: 'Comissário Chefe' },
    { value: 'COMISSARIO', label: 'Comissário' },
    { value: 'SUB_COMISSARIO', label: 'Sub-Comissário' },
    { value: 'SUPERINTENDENTE_CHEFE', label: 'Superintendente Chefe' },
    { value: 'SUPERINTENDENTE', label: 'Superintendente' },
    { value: 'INTENDENTE', label: 'Intendente' },
    { value: 'INSPECTOR_CHEFE', label: 'Inspector Chefe' },
    { value: 'INSPECTOR', label: 'Inspector' },
    { value: 'SUBINSPECTOR', label: 'Subinspector' },
    { value: 'PRIMEIRO_SUBCHEFE', label: '1.º Subchefe' },
    { value: 'SEGUNDO_SUBCHEFE', label: '2.º Subchefe' },
    { value: 'TERCEIRO_SUBCHEFE', label: '3.º Subchefe' },
    { value: 'AGENTE_PRIMEIRA_CLASSE', label: 'Agente de 1.ª Classe' },
    { value: 'AGENTE_SEGUNDA_CLASSE', label: 'Agente de 2.ª Classe' },
    { value: 'AGENTE_TERCEIRA_CLASSE', label: 'Agente de 3.ª Classe' },
    { value: 'ALISTADO', label: 'Alistado' }
  ];


  constructor(private usuarioService: UsuarioService,
              private router: Router) {
    this.getUsuario();
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

  closeModal() {
    this.isModalOpen = false;
    this.selectedUsuario= null
  }

  editUsuario(usuario:any) {
    this.selectedUsuario = usuario
    this.selectedUsuario.code = usuario.code
    this.isModalOpen = true;
  }

  getUsuario() {
    this.usuarioService.getUsuarios().subscribe(
      (data: any) => {
        this.filteredUsers = data
      },
      (error) => {
        console.error('Erro ao usaurio:', error);
      }
    );
  }

  toggleDropdown(index: number) {
    this.dropdownOpen = this.dropdownOpen === index ? null : index;
  }

  onCreateUser() {
    this.isModalOpen = true;
  }

  addCliente(usuario:any){
    this.usuarioService.addUsuario(usuario).subscribe(
      (_ : any) => {
        console.error("user add");
      },
      (error: any) => {
        console.error('Erro ao usaurio:', error);
      }
    );
  }

  addUsuario(usuario: any) {
    this.closeModal();
    if(!this.selectedUsuario){
      this.usuarioService.addUsuario(usuario).subscribe(
        (dados:any) => {
           usuario.uuid =dados.uuid;
           this.addCliente(usuario);
          this.getUsuario();
        },
        (error) => {
          console.error('Erro ao usaurio:', error);
        }
      );
    }else{
      this.usuarioService.editUsuario(usuario, this.selectedUsuario.uuid).subscribe(
        (_) => {
          this.getUsuario();
        },
        (error : any) => {
          console.error('Erro ao usaurio:', error);
        }
      );
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
        return this.tiposUsuarios.find((tipo: any) => tipo.value === permissao)?.label
  }
}

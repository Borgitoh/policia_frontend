import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/service/usuario-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor( private usuarioService: UsuarioService, private router: Router) {}
  logout() {
    this.usuarioService.logout(); 
    this.router.navigate(['/login']); 
  }
}

import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { DenunciaService } from 'src/app/service/denuncia.service';


@Component({
  selector: 'app-denuncia-list',
  templateUrl: './denuncia-list.component.html',
  styleUrls: ['./denuncia-list.component.scss'],
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
export class DenunciaListComponent {

  isModalOpen = false;
  registos: any[] = [];
  filteredRegistos: any[] = []; 
  selectedRegistos: any[] = [];
  selectedCategory = '';

  constructor(private denunciaService :DenunciaService) {
    this.getRegistros();
  }
  goList() {
    this.isModalOpen = false;
  }

  openCrime(){
    this.isModalOpen = true;
  }

  getRegistros() {
    this.denunciaService.getRegistros().subscribe(
      (data: any) => {
        this.registos = data; 
        this.filteredRegistos = data
      },
      (error) => {
        console.error('Erro ao resgistro:', error);
      }
    );
  }

  filterByCategory() {
    console.log(this.selectedCategory);
    if (this.selectedCategory) {
      this.filteredRegistos = this.registos.filter(reg => reg.tipo == this.selectedCategory);
      console.log(this.filteredRegistos);
    } else {
      this.filteredRegistos = [...this.registos]; 
    }
  }

  addRegistro(registro:any){
    this.denunciaService.addRegistro(registro).subscribe(
      (_ : any) => {
        console.error("user add");
        this.goList();
        this.getRegistros();
      },
      (error: any) => {
        console.error('Erro ao usaurio:', error);
      }
    );
  }
}

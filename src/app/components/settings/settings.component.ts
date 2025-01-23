import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  isModalOpen = true;
  isUserComponent = false;
  islogsComponent  = false;
  labelSettings: string = 'Configurações do Sistema';


  openComponent(valor:boolean, label:any,component:any){
    switch (component) {
      case 'user':
        this.isModalOpen= !valor;
        this.isUserComponent = valor;  
        this.labelSettings = label;
      break;
      case 'logs':
        this.isModalOpen= !valor;
        this.isUserComponent = !valor;  
        this.islogsComponent = valor
        this.labelSettings = label;
      break;
    
      default:
        this.isModalOpen = valor;
        this.isUserComponent = !valor;
        this.labelSettings= label;
        break;
    }
  }
}

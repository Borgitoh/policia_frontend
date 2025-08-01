import { Component, OnInit } from '@angular/core';
import { CriminalService } from '../../services/criminal.service';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  criminalStats: any = {};
  complaintStats: any = {};
  recentActivities: any[] = [
    {
      date: '2024-12-22',
      type: 'Queixa',
      description: 'Nova queixa de furto registrada - QX20240001',
      status: 'Aberta'
    },
    {
      date: '2024-12-22',
      type: 'Criminal',
      description: 'Ficha criminal atualizada - João António Silva',
      status: 'Concluído'
    },
    {
      date: '2024-12-21',
      type: 'Investigação',
      description: 'Caso de agressão em investigação - QX20240002',
      status: 'Em Progresso'
    },
    {
      date: '2024-12-21',
      type: 'Resolução',
      description: 'Caso de burla resolvido com sucesso',
      status: 'Resolvido'
    },
    {
      date: '2024-12-20',
      type: 'Alerta',
      description: 'Criminoso de alta periculosidade detectado',
      status: 'Urgente'
    }
  ];

  constructor(
    private criminalService: CriminalService,
    private complaintService: ComplaintService
  ) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.criminalService.getStatistics().subscribe(stats => {
      this.criminalStats = stats;
    });

    this.complaintService.getStatistics().subscribe(stats => {
      this.complaintStats = stats;
    });
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleString('pt-AO');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Concluído':
      case 'Resolvido':
        return 'bg-green-100 text-green-800';
      case 'Em Progresso':
      case 'Aberta':
        return 'bg-blue-100 text-blue-800';
      case 'Urgente':
        return 'bg-red-100 text-red-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getActivityTypeClass(type: string): string {
    switch (type) {
      case 'Queixa':
        return 'bg-angola-red bg-opacity-20 text-angola-red';
      case 'Criminal':
        return 'bg-pna-blue bg-opacity-20 text-pna-blue';
      case 'Investigação':
        return 'bg-angola-yellow bg-opacity-20 text-yellow-800';
      case 'Resolução':
        return 'bg-green-500 bg-opacity-20 text-green-800';
      case 'Alerta':
        return 'bg-red-500 bg-opacity-20 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

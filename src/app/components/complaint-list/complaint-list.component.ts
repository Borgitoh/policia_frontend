import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint.model';

@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss']
})
export class ComplaintListComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  
  filters = {
    status: '',
    tipoCrime: '',
    search: ''
  };

  statusOptions = ['Aberta', 'Em Investigação', 'Resolvida', 'Arquivada'];
  tiposCrime = [
    'Furto', 'Roubo', 'Agressão', 'Homicídio', 'Violação', 'Sequestro',
    'Burla', 'Corrupção', 'Tráfico de Droga', 'Violência Doméstica',
    'Vandalismo', 'Fraude', 'Extorsão', 'Outro'
  ];

  selectedComplaint: Complaint | null = null;
  showModal = false;

  constructor(private complaintService: ComplaintService) { }

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getComplaints().subscribe(complaints => {
      this.complaints = complaints;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.complaintService.filterComplaints(this.filters).subscribe(filtered => {
      this.filteredComplaints = filtered;
    });
  }

  clearFilters(): void {
    this.filters = {
      status: '',
      tipoCrime: '',
      search: ''
    };
    this.applyFilters();
  }

  viewComplaint(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedComplaint = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Aberta':
        return 'bg-blue-100 text-blue-800';
      case 'Em Investigação':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolvida':
        return 'bg-green-100 text-green-800';
      case 'Arquivada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(complaint: Complaint): string {
    if (complaint.suspeito.criminalExistente) {
      return 'border-l-4 border-red-500';
    }
    return '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-AO');
  }

  updateComplaintStatus(complaint: Complaint, newStatus: string): void {
    complaint.status = newStatus as any;
    this.complaintService.updateComplaint(complaint).subscribe(() => {
      this.loadComplaints();
    });
  }
}

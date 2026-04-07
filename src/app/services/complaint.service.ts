import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Complaint } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private complaintsSubject = new BehaviorSubject<Complaint[]>(this.getMockComplaints());
  complaints$ = this.complaintsSubject.asObservable();

  constructor() { }

  getComplaints(): Observable<Complaint[]> {
    return this.complaints$;
  }

  getComplaintById(id: string): Observable<Complaint | undefined> {
    const complaints = this.complaintsSubject.value;
    const complaint = complaints.find(c => c.id === id);
    return of(complaint);
  }

  addComplaint(complaint: Complaint): Observable<Complaint> {
    const complaints = this.complaintsSubject.value;
    complaint.id = this.generateId();
    complaint.numeroProcesso = this.generateProcessNumber();
    complaint.dataRegistro = new Date().toISOString().split('T')[0];
    complaint.status = 'Aberta';
    complaints.unshift(complaint);
    this.complaintsSubject.next(complaints);
    return of(complaint);
  }

  updateComplaint(complaint: Complaint): Observable<Complaint> {
    const complaints = this.complaintsSubject.value;
    const index = complaints.findIndex(c => c.id === complaint.id);
    if (index !== -1) {
      complaints[index] = complaint;
      this.complaintsSubject.next(complaints);
    }
    return of(complaint);
  }

  filterComplaints(filters: any): Observable<Complaint[]> {
    const complaints = this.complaintsSubject.value;
    let filtered = complaints;

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.tipoCrime) {
      filtered = filtered.filter(c => c.tipoCrime.toLowerCase().includes(filters.tipoCrime.toLowerCase()));
    }

    if (filters.search) {
      filtered = filtered.filter(c => 
        c.numeroProcesso.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.denunciante.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.suspeito.nome.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return of(filtered);
  }

  getStatistics(): Observable<any> {
    const complaints = this.complaintsSubject.value;
    const today = new Date().toISOString().split('T')[0];
    
    return of({
      totalQueixas: complaints.length,
      abertas: complaints.filter(c => c.status === 'Aberta').length,
      emInvestigacao: complaints.filter(c => c.status === 'Em Investigação').length,
      resolvidas: complaints.filter(c => c.status === 'Resolvida').length,
      arquivadas: complaints.filter(c => c.status === 'Arquivada').length,
      queixasHoje: complaints.filter(c => c.dataRegistro === today).length
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateProcessNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `QX${year}${random}`;
  }

  private getMockComplaints(): Complaint[] {
    return [
      {
        id: '1',
        numeroProcesso: 'QX20240001',
        dataRegistro: '2024-12-22',
        status: 'Aberta',
        tipoCrime: 'Furto',
        denunciante: {
          nome: 'Ana Maria Costa',
          bi: '123789456LA044',
          telefone: '923456781',
          endereco: 'Bairro Maianga, Luanda',
          email: 'ana.costa@email.ao',
          profissao: 'Professora',
          relacaoSuspeito: 'Desconhecido'
        },
        suspeito: {
          nome: 'Desconhecido',
          descricaoFisica: 'Homem negro, cerca de 30 anos, 1.75m de altura, cicatriz no braço direito',
          antecedentesConhecidos: false,
          criminalExistente: false
        },
        ocorrencia: {
          data: '2024-12-21',
          hora: '14:30',
          local: 'Rua da Missão, próximo ao Banco BIC',
          provincia: 'Luanda',
          municipio: 'Luanda',
          descricao: 'Furto de telemóvel através de carteirista em transporte público',
          testemunhas: [
            {
              nome: 'Pedro Silva',
              telefone: '912345679',
              endereco: 'Bairro Viana, Luanda',
              relato: 'Viu o suspeito fugir após o furto'
            }
          ],
          evidencias: ['Imagens de CCTV do banco']
        },
        observacoes: 'Caso similar ocorreu na semana passada na mesma zona',
        anexos: []
      },
      {
        id: '2',
        numeroProcesso: 'QX20240002',
        dataRegistro: '2024-12-20',
        status: 'Em Investigação',
        tipoCrime: 'Agressão',
        denunciante: {
          nome: 'Manuel Santos',
          bi: '987123456LA045',
          telefone: '934567892',
          endereco: 'Bairro Kilamba, Luanda',
          profissao: 'Comerciante',
          relacaoSuspeito: 'Vizinho'
        },
        suspeito: {
          nome: 'João António Silva',
          apelido: 'Zé Pequeno',
          bi: '123456789LA041',
          idade: 38,
          genero: 'M',
          descricaoFisica: 'Homem negro, 1.80m, forte',
          endereco: 'Bairro Operário, Luanda',
          antecedentesConhecidos: true,
          criminalExistente: true,
          criminalId: '1'
        },
        ocorrencia: {
          data: '2024-12-19',
          hora: '19:00',
          local: 'Bairro Kilamba, Bloco 45',
          provincia: 'Luanda',
          municipio: 'Luanda',
          descricao: 'Agressão física após discussão sobre música alta',
          testemunhas: [
            {
              nome: 'Maria Santos',
              telefone: '923456783',
              endereco: 'Bairro Kilamba, Bloco 45',
              relato: 'Presenciou toda a agressão'
            }
          ],
          evidencias: ['Relatório médico da vítima', 'Fotos das lesões']
        },
        investigador: 'Inspector Carlos Mendes',
        observacoes: 'Suspeito tem histórico de violência',
        anexos: ['relatorio_medico.pdf', 'fotos_lesoes.jpg']
      }
    ];
  }
}

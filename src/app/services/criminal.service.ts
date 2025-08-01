import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Criminal, Crime } from '../models/criminal.model';

@Injectable({
  providedIn: 'root'
})
export class CriminalService {
  private criminalsSubject = new BehaviorSubject<Criminal[]>(this.getMockCriminals());
  criminals$ = this.criminalsSubject.asObservable();

  constructor() { }

  getCriminals(): Observable<Criminal[]> {
    return this.criminals$;
  }

  getCriminalById(id: string): Observable<Criminal | undefined> {
    const criminals = this.criminalsSubject.value;
    const criminal = criminals.find(c => c.id === id);
    return of(criminal);
  }

  searchCriminals(query: string): Observable<Criminal[]> {
    const criminals = this.criminalsSubject.value;
    const filtered = criminals.filter(c => 
      c.nome.toLowerCase().includes(query.toLowerCase()) ||
      c.apelido.toLowerCase().includes(query.toLowerCase()) ||
      c.bi.includes(query)
    );
    return of(filtered);
  }

  addCriminal(criminal: Criminal): Observable<Criminal> {
    const criminals = this.criminalsSubject.value;
    criminal.id = this.generateId();
    criminal.dataRegistro = new Date().toISOString().split('T')[0];
    criminals.push(criminal);
    this.criminalsSubject.next(criminals);
    return of(criminal);
  }

  updateCriminal(criminal: Criminal): Observable<Criminal> {
    const criminals = this.criminalsSubject.value;
    const index = criminals.findIndex(c => c.id === criminal.id);
    if (index !== -1) {
      criminals[index] = criminal;
      this.criminalsSubject.next(criminals);
    }
    return of(criminal);
  }

  addCrimeToCriminal(criminalId: string, crime: Crime): Observable<boolean> {
    const criminals = this.criminalsSubject.value;
    const criminal = criminals.find(c => c.id === criminalId);
    if (criminal) {
      crime.id = this.generateId();
      crime.numeroProcesso = this.generateProcessNumber();
      criminal.crimes.push(crime);
      this.updatePericulosityLevel(criminal);
      this.criminalsSubject.next(criminals);
      return of(true);
    }
    return of(false);
  }

  getStatistics(): Observable<any> {
    const criminals = this.criminalsSubject.value;
    const today = new Date().toISOString().split('T')[0];
    
    return of({
      totalCriminosos: criminals.length,
      procurados: criminals.filter(c => c.status === 'Procurado').length,
      detidos: criminals.filter(c => c.status === 'Detido').length,
      condenados: criminals.filter(c => c.status === 'Condenado').length,
      registrosHoje: criminals.filter(c => c.dataRegistro === today).length,
      periculosidadeAlta: criminals.filter(c => c.nivelPericulosidade === 'Alto' || c.nivelPericulosidade === 'Extremo').length
    });
  }

  private updatePericulosityLevel(criminal: Criminal): void {
    const crimesCount = criminal.crimes.length;
    const violentCrimes = criminal.crimes.filter(c => 
      c.tipo.toLowerCase().includes('homicídio') ||
      c.tipo.toLowerCase().includes('sequestro') ||
      c.tipo.toLowerCase().includes('violação') ||
      c.tipo.toLowerCase().includes('agressão')
    ).length;

    if (violentCrimes >= 3 || crimesCount >= 10) {
      criminal.nivelPericulosidade = 'Extremo';
    } else if (violentCrimes >= 2 || crimesCount >= 6) {
      criminal.nivelPericulosidade = 'Alto';
    } else if (violentCrimes >= 1 || crimesCount >= 3) {
      criminal.nivelPericulosidade = 'Médio';
    } else {
      criminal.nivelPericulosidade = 'Baixo';
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateProcessNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PNA${year}${random}`;
  }

  private getMockCriminals(): Criminal[] {
    return [
      {
        id: '1',
        nome: 'João António Silva',
        apelido: 'Zé Pequeno',
        bi: '123456789LA041',
        dataNascimento: '1985-05-15',
        idade: 38,
        genero: 'M',
        endereco: 'Bairro Operário, Luanda',
        telefone: '923456789',
        profissao: 'Desempregado',
        nivelAcademico: 'Ensino Médio',
        estadoCivil: 'Solteiro',
        nomePai: 'António Silva',
        nomeMae: 'Maria Silva',
        nivelPericulosidade: 'Alto',
        status: 'Procurado',
        dataRegistro: '2024-01-15',
        observacoes: 'Histórico de violência doméstica e furtos',
        crimes: [
          {
            id: '1',
            tipo: 'Furto Qualificado',
            descricao: 'Furto de veículo no Largo da Mutamba',
            dataOcorrencia: '2024-01-10',
            local: 'Largo da Mutamba, Luanda',
            numeroProcesso: 'PNA20240001',
            statusProcesso: 'Em Investigação'
          },
          {
            id: '2',
            tipo: 'Agressão',
            descricao: 'Agressão física em via pública',
            dataOcorrencia: '2023-12-05',
            local: 'Rua Major Kanhangulo, Luanda',
            numeroProcesso: 'PNA20230154',
            statusProcesso: 'Condenado',
            sentenca: '6 meses de prisão',
            dataCondenacao: '2024-02-15'
          }
        ]
      },
      {
        id: '2',
        nome: 'Maria Santos Fernandes',
        apelido: 'Negra',
        bi: '987654321LA042',
        dataNascimento: '1990-08-22',
        idade: 33,
        genero: 'F',
        endereco: 'Bairro Rangel, Luanda',
        telefone: '912345678',
        profissao: 'Comerciante',
        nivelAcademico: '9ª Classe',
        estadoCivil: 'Casada',
        nomePai: 'Pedro Santos',
        nomeMae: 'Ana Santos',
        nivelPericulosidade: 'Médio',
        status: 'Em Julgamento',
        dataRegistro: '2024-02-20',
        observacoes: 'Envolvida em esquema de burla',
        crimes: [
          {
            id: '3',
            tipo: 'Burla',
            descricao: 'Esquema de venda de produtos inexistentes',
            dataOcorrencia: '2024-02-15',
            local: 'Mercado do Roque Santeiro',
            numeroProcesso: 'PNA20240025',
            statusProcesso: 'Em Julgamento'
          }
        ]
      },
      {
        id: '3',
        nome: 'Carlos Manuel Dos Santos',
        apelido: 'Carlinhos',
        bi: '456789123LA043',
        dataNascimento: '1988-12-03',
        idade: 35,
        genero: 'M',
        endereco: 'Bairro Sambizanga, Luanda',
        telefone: '934567890',
        profissao: 'Mecânico',
        nivelAcademico: 'Ensino Técnico',
        estadoCivil: 'Divorciado',
        nomePai: 'Manuel Santos',
        nomeMae: 'Teresa Santos',
        nivelPericulosidade: 'Baixo',
        status: 'Livre',
        dataRegistro: '2023-11-10',
        observacoes: 'Rehabilitado, cumprindo pena alternativa',
        crimes: [
          {
            id: '4',
            tipo: 'Condução sob Efeito de Álcool',
            descricao: 'Condução em estado de embriaguez',
            dataOcorrencia: '2023-11-05',
            local: 'Marginal de Luanda',
            numeroProcesso: 'PNA20230089',
            statusProcesso: 'Condenado',
            sentenca: 'Multa e suspensão da carta de condução',
            dataCondenacao: '2023-12-20'
          }
        ]
      }
    ];
  }
}

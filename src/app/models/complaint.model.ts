export interface Complaint {
  id: string;
  numeroProcesso: string;
  dataRegistro: string;
  status: 'Aberta' | 'Em Investigação' | 'Resolvida' | 'Arquivada';
  tipoCrime: string;
  denunciante: Denunciante;
  suspeito: SuspeitoComplaint;
  ocorrencia: Ocorrencia;
  investigador?: string;
  observacoes: string;
  anexos: string[];
}

export interface Denunciante {
  nome: string;
  bi: string;
  telefone: string;
  endereco: string;
  email?: string;
  profissao: string;
  relacaoSuspeito: string;
}

export interface SuspeitoComplaint {
  nome: string;
  apelido?: string;
  bi?: string;
  idade?: number;
  genero?: 'M' | 'F';
  descricaoFisica: string;
  endereco?: string;
  profissao?: string;
  antecedentesConhecidos: boolean;
  criminalExistente?: boolean;
  criminalId?: string;
}

export interface Ocorrencia {
  data: string;
  hora: string;
  local: string;
  provincia: string;
  municipio: string;
  descricao: string;
  testemunhas: Testemunha[];
  evidencias: string[];
}

export interface Testemunha {
  nome: string;
  telefone: string;
  endereco: string;
  relato: string;
}

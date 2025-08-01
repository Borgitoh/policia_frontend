export interface Criminal {
  id: string;
  nome: string;
  apelido: string;
  bi: string;
  dataNascimento: string;
  idade: number;
  genero: 'M' | 'F';
  foto?: string;
  endereco: string;
  telefone: string;
  profissao: string;
  nivelAcademico: string;
  estadoCivil: string;
  nomePai: string;
  nomeMae: string;
  nivelPericulosidade: 'Baixo' | 'Médio' | 'Alto' | 'Extremo';
  status: 'Procurado' | 'Detido' | 'Condenado' | 'Livre' | 'Em Julgamento';
  dataRegistro: string;
  crimes: Crime[];
  observacoes: string;
}

export interface Crime {
  id: string;
  tipo: string;
  descricao: string;
  dataOcorrencia: string;
  local: string;
  numeroProcesso: string;
  statusProcesso: 'Aberto' | 'Em Investigação' | 'Em Julgamento' | 'Condenado' | 'Arquivado';
  sentenca?: string;
  dataCondenacao?: string;
}

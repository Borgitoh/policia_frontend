import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Agent {
  id: string;
  nome: string;
  bi: string;
  posto: string;
  provincia: string;
  telefone: string;
  email: string;
  dataAdmissao: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  ultimoLogin: string;
}

@Component({
  selector: 'app-agent-management',
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.scss']
})
export class AgentManagementComponent implements OnInit {
  agents: Agent[] = [];
  filteredAgents: Agent[] = [];
  agentForm!: FormGroup;
  selectedAgent: Agent | null = null;
  showForm = false;
  isEditing = false;
  searchQuery = '';

  postos = [
    'Comissário', 'Subcomissário', 'Intendente', 'Subintendente',
    'Chefe Principal', 'Chefe', 'Subchefe', 'Agente Principal', 'Agente'
  ];

  provincias = [
    'Luanda', 'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
    'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 'Namibe',
    'Uíge', 'Zaire'
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
    this.loadMockData();
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  initForm(): void {
    this.agentForm = this.fb.group({
      nome: ['', Validators.required],
      bi: ['', Validators.required],
      posto: ['', Validators.required],
      provincia: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadMockData(): void {
    this.agents = [
      {
        id: '1',
        nome: 'Carlos Manuel Santos',
        bi: '123456789LA041',
        posto: 'Comissário',
        provincia: 'Luanda',
        telefone: '923456789',
        email: 'carlos.santos@pna.gov.ao',
        dataAdmissao: '2020-03-15',
        status: 'Ativo',
        ultimoLogin: '2024-12-22 09:30:00'
      },
      {
        id: '2',
        nome: 'Ana Maria Silva',
        bi: '987654321LA042',
        posto: 'Intendente',
        provincia: 'Luanda',
        telefone: '912345678',
        email: 'ana.silva@pna.gov.ao',
        dataAdmissao: '2019-08-20',
        status: 'Ativo',
        ultimoLogin: '2024-12-22 08:15:00'
      },
      {
        id: '3',
        nome: 'João Fernando Costa',
        bi: '456789123LA043',
        posto: 'Agente Principal',
        provincia: 'Benguela',
        telefone: '934567890',
        email: 'joao.costa@pna.gov.ao',
        dataAdmissao: '2021-01-10',
        status: 'Inativo',
        ultimoLogin: '2024-12-20 16:45:00'
      }
    ];
  }

  applyFilters(): void {
    this.filteredAgents = this.agents.filter(agent =>
      agent.nome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      agent.bi.includes(this.searchQuery) ||
      agent.posto.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.selectedAgent = null;
    this.agentForm.reset();
  }

  editAgent(agent: Agent): void {
    this.showForm = true;
    this.isEditing = true;
    this.selectedAgent = agent;
    this.agentForm.patchValue(agent);
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.selectedAgent = null;
    this.agentForm.reset();
  }

  onSubmit(): void {
    if (this.agentForm.valid) {
      const formData = this.agentForm.value;
      
      if (this.isEditing && this.selectedAgent) {
        // Update existing agent
        const index = this.agents.findIndex(a => a.id === this.selectedAgent!.id);
        if (index !== -1) {
          this.agents[index] = { ...this.selectedAgent, ...formData };
        }
      } else {
        // Add new agent
        const newAgent: Agent = {
          id: (this.agents.length + 1).toString(),
          ...formData,
          dataAdmissao: new Date().toISOString().split('T')[0],
          status: 'Ativo' as const,
          ultimoLogin: 'Nunca'
        };
        this.agents.push(newAgent);
      }
      
      this.applyFilters();
      this.closeForm();
    }
  }

  toggleStatus(agent: Agent): void {
    agent.status = agent.status === 'Ativo' ? 'Inativo' : 'Ativo';
  }

  deleteAgent(agent: Agent): void {
    if (confirm(`Tem certeza que deseja excluir o agente ${agent.nome}?`)) {
      this.agents = this.agents.filter(a => a.id !== agent.id);
      this.applyFilters();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-gray-100 text-gray-800';
      case 'Suspenso':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-AO');
  }
}

import { Component, OnInit } from '@angular/core';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  module: string;
  action: string;
  user: string;
  details: string;
  ip: string;
}

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss']
})
export class SystemLogsComponent implements OnInit {
  logs: SystemLog[] = [];
  filteredLogs: SystemLog[] = [];

  filters = {
    level: '',
    module: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  };

  levels = ['INFO', 'WARNING', 'ERROR', 'SUCCESS'];
  modules = ['Authentication', 'Criminal Records', 'Complaints', 'Users', 'System', 'Backup'];

  selectedLog: SystemLog | null = null;
  showModal = false;

  constructor() {
    this.loadMockLogs();
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  loadMockLogs(): void {
    this.logs = [
      {
        id: '1',
        timestamp: '2024-12-22 10:30:15',
        level: 'SUCCESS',
        module: 'Authentication',
        action: 'Login realizado com sucesso',
        user: 'Carlos Santos (Comissário)',
        details: 'Login bem-sucedido no sistema PNA',
        ip: '192.168.1.10'
      },
      {
        id: '2',
        timestamp: '2024-12-22 10:25:33',
        level: 'INFO',
        module: 'Criminal Records',
        action: 'Nova ficha criminal registrada',
        user: 'Ana Silva (Intendente)',
        details: 'Ficha criminal criada para João António Silva',
        ip: '192.168.1.15'
      },
      {
        id: '3',
        timestamp: '2024-12-22 10:20:45',
        level: 'INFO',
        module: 'Complaints',
        action: 'Nova queixa registrada',
        user: 'Carlos Santos (Comissário)',
        details: 'Queixa QX20240001 registrada - Furto no Roque Santeiro',
        ip: '192.168.1.10'
      },
      {
        id: '4',
        timestamp: '2024-12-22 09:15:22',
        level: 'WARNING',
        module: 'System',
        action: 'Tentativa de acesso negada',
        user: 'Sistema',
        details: 'Múltiplas tentativas de login falharam para usuário: admin',
        ip: '192.168.1.25'
      },
      {
        id: '5',
        timestamp: '2024-12-22 08:00:00',
        level: 'SUCCESS',
        module: 'Backup',
        action: 'Backup automático concluído',
        user: 'Sistema',
        details: 'Backup diário executado com sucesso - 234MB',
        ip: 'localhost'
      },
      {
        id: '6',
        timestamp: '2024-12-21 18:45:30',
        level: 'ERROR',
        module: 'System',
        action: 'Erro de conexão com banco de dados',
        user: 'Sistema',
        details: 'Falha temporária na conexão com o banco de dados principal',
        ip: 'localhost'
      },
      {
        id: '7',
        timestamp: '2024-12-21 16:20:15',
        level: 'INFO',
        module: 'Users',
        action: 'Novo agente cadastrado',
        user: 'Carlos Santos (Comissário)',
        details: 'Agente João Costa cadastrado no sistema',
        ip: '192.168.1.10'
      },
      {
        id: '8',
        timestamp: '2024-12-21 14:30:45',
        level: 'WARNING',
        module: 'Complaints',
        action: 'Criminoso reincidente detectado',
        user: 'Ana Silva (Intendente)',
        details: 'Sistema detectou criminoso com histórico ao registrar nova queixa',
        ip: '192.168.1.15'
      }
    ];
  }

  applyFilters(): void {
    this.filteredLogs = this.logs.filter(log => {
      const matchesLevel = !this.filters.level || log.level === this.filters.level;
      const matchesModule = !this.filters.module || log.module === this.filters.module;
      const matchesSearch = !this.filters.search ||
        log.action.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        log.user.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        log.details.toLowerCase().includes(this.filters.search.toLowerCase());

      let matchesDate = true;
      if (this.filters.dateFrom) {
        const logDate = new Date(log.timestamp);
        const fromDate = new Date(this.filters.dateFrom);
        matchesDate = logDate >= fromDate;
      }
      if (this.filters.dateTo && matchesDate) {
        const logDate = new Date(log.timestamp);
        const toDate = new Date(this.filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = logDate <= toDate;
      }

      return matchesLevel && matchesModule && matchesSearch && matchesDate;
    });
  }

  clearFilters(): void {
    this.filters = {
      level: '',
      module: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    };
    this.applyFilters();
  }

  viewLog(log: SystemLog): void {
    this.selectedLog = log;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedLog = null;
  }

  getLevelClass(level: string): string {
    switch (level) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getLevelIcon(level: string): string {
    switch (level) {
      case 'SUCCESS':
        return '✅';
      case 'INFO':
        return 'ℹ️';
      case 'WARNING':
        return '⚠️';
      case 'ERROR':
        return '❌';
      default:
        return '📝';
    }
  }

  exportLogs(): void {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pna_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(): string {
    const headers = ['Timestamp', 'Level', 'Module', 'Action', 'User', 'Details', 'IP'];
    const csvRows = [headers.join(',')];

    this.filteredLogs.forEach(log => {
      const row = [
        log.timestamp,
        log.level,
        log.module,
        `"${log.action}"`,
        `"${log.user}"`,
        `"${log.details}"`,
        log.ip
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('pt-AO');
  }

  getLogCountByLevel(level: string): number {
    return this.logs.filter(log => log.level === level).length;
  }
}

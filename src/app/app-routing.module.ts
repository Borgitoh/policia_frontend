import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PageComponent } from './components/page/page.component';
import { CriminalRecordComponent } from './components/criminal-record/criminal-record.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RegisterComplaintComponent } from './components/register-complaint/register-complaint.component';
import { ComplaintListComponent } from './components/complaint-list/complaint-list.component';
import { CriminalSearchComponent } from './components/criminal-search/criminal-search.component';
import { AgentManagementComponent } from './components/agent-management/agent-management.component';
import { SystemLogsComponent } from './components/system-logs/system-logs.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, children: [
    { path: '', component: PageComponent },
    { path: 'page', component: PageComponent },
    { path: 'register-complaint', component: RegisterComplaintComponent },
    { path: 'complaint-list', component: ComplaintListComponent },
    { path: 'criminal-search', component: CriminalSearchComponent },
    { path: 'criminal-records', component: CriminalRecordComponent },
    { path: 'agent-management', component: AgentManagementComponent },
    { path: 'system-logs', component: SystemLogsComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'settings', component: SettingsComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

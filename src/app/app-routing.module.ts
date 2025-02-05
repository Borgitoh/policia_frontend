import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PageComponent } from './components/page/page.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CriminalListComponent } from './components/list/criminal-list/criminal-list.component';
import { DenunciaListComponent } from './components/list/denuncia-list/denuncia-list.component';
import { loginGuard } from './login.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [loginGuard], 
    children: [
      { path: '', component: PageComponent },
      { path: 'page', component: PageComponent },
      { path: 'denuncia', component: DenunciaListComponent },
      { path: 'criminal-records', component: CriminalListComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

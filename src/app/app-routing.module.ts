import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PageComponent } from './components/page/page.component';
import { CriminalRecordComponent } from './components/criminal-record/criminal-record.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component:HomeComponent ,children: [
    { path: '', component: PageComponent }, 
    { path: 'page', component: PageComponent },
    { path: 'criminal-records', component: CriminalRecordComponent } ,
    { path: 'reports', component: ReportsComponent },
    { path: 'settings', component: SettingsComponent }  
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

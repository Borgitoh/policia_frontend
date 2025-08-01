import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PageComponent } from './components/page/page.component';
import { CriminalRecordComponent } from './components/criminal-record/criminal-record.component';
import { WebcamSnapshotComponent } from './components/webcam-snapshot/webcam-snapshot.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RegisterComplaintComponent } from './components/register-complaint/register-complaint.component';
import { ComplaintListComponent } from './components/complaint-list/complaint-list.component';
import { CriminalSearchComponent } from './components/criminal-search/criminal-search.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    PageComponent,
    CriminalRecordComponent,
    WebcamSnapshotComponent,
    ReportsComponent,
    SettingsComponent,
    RegisterComplaintComponent,
    ComplaintListComponent,
    CriminalSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

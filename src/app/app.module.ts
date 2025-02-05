import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Briefcase, CalendarDays, Check, CheckCheck, CircleSlash, Clock3, Clock4, Coins, DollarSign, Download, Edit, Ellipsis, Eye, EyeOff, File, FileIcon, FileText, HandCoins, Home, Lock, LucideAngularModule, Menu, Pencil, Plus, Settings, ShieldBan, ShoppingCart, Trash2, User, UserCheck, UserRoundCog, Users } from 'lucide-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PageComponent } from './components/page/page.component';
import { CriminalRecordComponent } from './components/criminal-record/criminal-record.component';
import { WebcamSnapshotComponent } from './components/webcam-snapshot/webcam-snapshot.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UsersLitComponent } from './components/list/users-lit/users-lit.component';
import { UserModalComponent } from './components/modal/user-modal/user-modal.component';
import { NgxMaskDirective, provideNgxMask, } from 'ngx-mask';
import { DatePipe } from '@angular/common';
import { LogsComponent } from './components/logs/logs.component';
import { CriminalListComponent } from './components/list/criminal-list/criminal-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DenunciaListComponent } from './components/list/denuncia-list/denuncia-list.component';
import { DenunciaComponent } from './components/denuncia/denuncia.component';

const icon: any =
  {
    User,
    Clock4,
    DollarSign,
    HandCoins,
    UserRoundCog,
    Settings,
    Edit,
    Trash2,
    Plus,
    Ellipsis,
    Home,
    CalendarDays,
    Briefcase,
    FileText,
    Users,
    ShoppingCart,
    Clock3,
    Download,
    CheckCheck,
    Pencil,
    CircleSlash,
    Menu,
    Lock,
    EyeOff,
    Eye,
    Check,
    Coins,
    File,
    ShieldBan
  }

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
    UsersLitComponent,
    UserModalComponent,
    LogsComponent,
    CriminalListComponent,
    DenunciaListComponent,
    DenunciaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LucideAngularModule.pick(icon),
    NgxMaskDirective,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    DatePipe,
    provideNgxMask(),
    { provide: LOCALE_ID,
      useValue: 'pt'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { PromesasComponent } from './promesas/promesas.component';
import { LoginGuardGuard } from '../services/guards/login-guard.guard';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../services/guards/admin.guard';
import { VerificaTokenGuard } from '../services/guards/verifica-token.guard';


const pagesRoutes: Routes = [
        {
          path: 'dashboard',
          component: DashboardComponent,
          canActivate: [ VerificaTokenGuard ],
          data: { titulo: 'Dashboard'}
        },
        { path: 'profile', component: ProfileComponent, data: { titulo: 'User Profile'}},
        { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress'}},
        { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Graphics'}},
        { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promises'}},
        { path: 'account-setting', component: AccountSettingComponent, data: { titulo: 'Settings'}},
        { path: 'search/:termino', component: BusquedaComponent, data: { titulo: 'Search'}},
        //Mantenimientos
        {
          path: 'users',
          component: UsersComponent,
          canActivate: [ AdminGuard],
          data: { titulo: 'User maintenance'}
        },
        { path: 'hospitals', component: HospitalesComponent, data: { titulo: 'Hospital maintenance'}},
        { path: 'doctors', component: MedicosComponent, data: { titulo: 'Doctors maintenance'}},
        { path: 'doctor/:id', component: MedicoComponent, data: { titulo: 'Doctor information'}},
        { path: '', redirectTo: '/dashboard', pathMatch: 'full'},

  ];

  // tslint:disable-next-line: align
  export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
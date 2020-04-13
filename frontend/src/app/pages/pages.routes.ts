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


const pagesRoutes: Routes = [
    {
      path: '',
      component: PagesComponent,
      canActivate: [LoginGuardGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard'}},
        { path: 'profile', component: ProfileComponent, data: { titulo: 'User Profile'}},
        { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress'}},
        { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Graphics'}},
        { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promises'}},
        { path: 'account-setting', component: AccountSettingComponent, data: { titulo: 'Settings'}},

        //Mantenimientos
        { path: 'users', component: UsersComponent, data: { titulo: 'User maintenance'}},
        { path: 'hospitals', component: HospitalesComponent, data: { titulo: 'Hospital maintenance'}},
        { path: 'doctors', component: MedicosComponent, data: { titulo: 'Doctors maintenance'}},
        { path: 'doctor/:id', component: MedicoComponent, data: { titulo: 'Doctor information'}},
        { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      ]
    }

  ];

  // tslint:disable-next-line: align
  export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';



const pagesRoutes: Routes = [
    {
      path: '',
      component: PagesComponent,
      children: [
        { path: 'dashboard', component: DashboardComponent},
        { path: 'progress', component: ProgressComponent},
        { path: 'graficas1', component: Graficas1Component},
        { path: 'account-setting', component: AccountSettingComponent},
        { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      ]
    }

  ];

  export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
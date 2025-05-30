import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { AccessDeniedComponent } from '../../shared/components/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [     
      {
        path: 'system-admin',
        loadChildren: () =>
          import('././admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
        //  canActivate: [AuthGuard],
      },
      {
        path: 'access-denied',
        pathMatch: 'full',
        component: AccessDeniedComponent,
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }

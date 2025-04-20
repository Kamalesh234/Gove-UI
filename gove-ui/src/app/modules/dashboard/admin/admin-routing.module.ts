import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyMasterComponent } from './pages/company/company-master/company-master.component';
import { UserCreateComponent } from './pages/user/user-create/user-create.component';
import { UserManagementComponent } from './pages/user/user-management/user-management.component';

const routes: Routes = [
  {
    path:'user-management',
    component:UserManagementComponent
  },
  {
    path:'',
    redirectTo:'user-management',
    pathMatch:'full'
  },

    {     
      path:'user-create',
      component:UserCreateComponent
    },
    {
      path:'company-master',
      component:CompanyMasterComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyMasterComponent } from './pages/company/company-master/company-master.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'user-management',
    pathMatch:'full'
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

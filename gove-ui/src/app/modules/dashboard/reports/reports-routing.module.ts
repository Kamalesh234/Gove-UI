import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { NpareportComponent } from './pages/npareport/npareport.component'
import { NpahistoryComponent } from './pages/npahistory/npahistory.component';
import  {SmireportComponent} from './pages/smireport/smireport.component';
import {SmaTransladerComponent} from './pages/sma-translader/sma-translader.component';
import { NpareportOpertionalComponent } from './pages/npareport-opertional/npareport-opertional.component';
import { CollectionreportComponent } from './pages/collectionreport/collectionreport.component';
import {CollectiontranslanderComponent} from './pages/collectiontranslander/collectiontranslander.component'
import {MisreportsComponent} from './pages/misreports/misreports.component';
import { MistranslanderComponent } from './pages/mistranslander/mistranslander.component';
import {SalesIncentiveComponent} from './pages/sales-incentive/sales-incentive.component';
import {CollectionincentivereportComponent} from './pages/collectionincentivereport/collectionincentivereport.component'
const routes: Routes = [
   {
      path:'npareport',
      component:NpareportComponent
    },
    {
      path:'npareport-opertional',
      component:NpareportOpertionalComponent
    },
    {
      path:'npahistory',
      component:NpahistoryComponent
    },
    {
      path:'smareport',
      component:SmireportComponent
    },
    {
      path:'smareport_translader',
      component:SmaTransladerComponent
    },
    {
      path:'collectionreport',
      component:CollectionreportComponent
    },
    {
      path:'collectiontranslader',
      component:CollectiontranslanderComponent
    },
    {
      path:'misreport',
      component:MisreportsComponent
    },
    {
      path:'mistranslader',
      component:MistranslanderComponent
    },
    {
      path:'salesincentive',
      component:SalesIncentiveComponent
    },
    {
      path:'collectionincentive',
      component:CollectionincentivereportComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

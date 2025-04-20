
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NpareportComponent } from './pages/npareport/npareport.component';
import { NpahistoryComponent } from './pages/npahistory/npahistory.component';
import { SmireportComponent } from './pages/smireport/smireport.component';
import { NpareportOpertionalComponent } from './pages/npareport-opertional/npareport-opertional.component';
import { SmaTransladerComponent } from './pages/sma-translader/sma-translader.component';
import { CollectionreportComponent } from './pages/collectionreport/collectionreport.component';
import { CollectiontranslanderComponent } from './pages/collectiontranslander/collectiontranslander.component';
import { MisreportsComponent } from './pages/misreports/misreports.component';
import { MistranslanderComponent } from './pages/mistranslander/mistranslander.component';
import { SalesIncentiveComponent } from './pages/sales-incentive/sales-incentive.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CollectionincentivereportComponent } from './pages/collectionincentivereport/collectionincentivereport.component';
@NgModule({
  declarations: [ 
    NpareportComponent, NpahistoryComponent, SmireportComponent, NpareportOpertionalComponent, SmaTransladerComponent, CollectionreportComponent, CollectiontranslanderComponent, MisreportsComponent, MistranslanderComponent, SalesIncentiveComponent, CollectionincentivereportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
})
export class ReportsModule {}

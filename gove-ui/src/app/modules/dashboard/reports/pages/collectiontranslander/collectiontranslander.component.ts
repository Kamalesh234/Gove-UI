import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { FOSProspectService } from '../../../../../../data/services/feature/prospectMaster/prospects.service';
import { UserManagementService } from '../../../../../../data/services/feature/userManagement/user-management.service';
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { IExistinghSMARequest,IGoveBranchLookup,IFOSLookup,IGoveEMPCodeLookup,IExistinghSMARequestData } from '../../../../../../core/interfaces/app/request/IFOSModels';


@Component({
  selector: 'app-collectiontranslander',
  templateUrl: './collectiontranslander.component.html',
  styleUrl: './collectiontranslander.component.scss'
})
export class CollectiontranslanderComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showGrid: boolean = false;
  public CollectionTransladerForm: FormGroup;
  public loggedInUser: any = {};
  branchData: any[] = [];
  paginatedBranchData: any[] = [];
     constructor(
       private fb: FormBuilder,
       private prospectService: FOSProspectService,
       private router: Router,
       private loaderService: LoaderService,
       private toastr: ToastrService,
       private reportservice: ReportsService
     ) {
      this.CollectionTransladerForm = this.fb.group({
        FromDate : [''],
        ToDate:['']
      });
     }
     ngOnInit(): void {
        
     }
     ngAfterViewInit() {
      this.paginator.page.subscribe(() => this.updatePaginatedData()); 
      this.updatePaginatedData(); // Ensure initial data is set
    }
    updatePaginatedData() {
      if (this.paginator) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        this.paginatedBranchData = this.branchData.slice(startIndex, endIndex);
      }
    }   
     
  CollectionTranslader():void{
    if (!this.CollectionTransladerForm.get('FromDate')?.value) {
      this.toastr.error('FromDate is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
    if (!this.CollectionTransladerForm.get('ToDate')?.value) {
      this.toastr.error('ToDate is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
      this.loaderService.showLoader();
      const companyId = this.loggedInUser?.companyId || 1; // Use dynamic companyId if required
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
  
    this.reportservice
    .fetchCollectiondetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: "",
      buckettype: this.CollectionTransladerForm.value.FromDate,
      employeecode : "",
      cutoffdate: this.CollectionTransladerForm.value.ToDate,
      schedule_ID:0 ,
      options : 2
    }).subscribe({
        next: (response: any) => {
          if (response && response.message && response.message.length > 0) {
            this.branchData = response.message; // Assign the response data correctly
            this.showGrid = this.branchData.length > 0; // Show the table only if there is data
            setTimeout(() => {
              this.updatePaginatedData(); // Ensure paginator updates after data loads
            }, 0);
          } else {
            this.toastr.error('No Records.');
            this.branchData = [];
            this.showGrid = false;
          }
        },
        error: (err: any) => {
          this.toastr.error('Error fetching  details.');
          this.branchData = [];
          this.showGrid = false;
        }
      });
  } 
  view(Schedule_ID: string, action: string,ScheduleDate :string): void {
    this.router.navigate(['/dashboard/reports/collectionreport'], { queryParams: { Schedule_ID, action,ScheduleDate } });
  }
  clear(){
    this.showGrid = false;
    this.branchData = [];
    this.paginatedBranchData = [];
    this.CollectionTransladerForm.reset({
      FromDate: '',
      ToDate: ''
    });
  }
 
}

import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ReportsService } from '../../../../../../data/services/feature/Reports/Reports-service';
import { LoaderService } from '../../../../../../data/services/shared/loader.service';

@Component({
  selector: 'app-mistranslander',
  templateUrl: './mistranslander.component.html',
  styleUrl: './mistranslander.component.scss'
})
export class MistranslanderComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showGrid: boolean = false;
  public MISTransladerForm: FormGroup;
  branchData: any[] = [];
  paginatedBranchData: any[] = [];

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportservice: ReportsService,
    private fb: FormBuilder,
  ) {
    this.MISTransladerForm = this.fb.group({
      FromDate : [''],
      ToDate:['']
    });
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

  MISTranslader(): void {
    if (!this.MISTransladerForm.get('FromDate')?.value) {
      this.toastr.error('FromDate is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
    if (!this.MISTransladerForm.get('ToDate')?.value) {
      this.toastr.error('ToDate is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
    this.loaderService.showLoader();
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const companyId = 1; // Change if dynamic value needed

    this.reportservice.fetchMISdetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: "",
      maturitytype: this.MISTransladerForm.value.FromDate,
      employeecode: "",
      cutoffdate: this.MISTransladerForm.value.ToDate ,
      schedule_ID: 0,
      options: 2
    }).subscribe({
      next: (response: any) => {
        if (response && response.message && response.message.length > 0) {
          this.branchData = response.message;
          this.showGrid = this.branchData.length > 0; // Corrected condition
          setTimeout(() => {
            this.updatePaginatedData(); // Ensure paginator updates after data loads
          }, 0);
        } else {
          this.toastr.error('No Records.');
          this.branchData = [];
          this.showGrid = false;
        }
      },
      error: () => {
        this.toastr.error('Error fetching details.');
        this.branchData = [];
        this.showGrid = false;
      }
    });
  }

 

  view(Schedule_ID: string, action: string,ScheduleDate :string): void {
    this.router.navigate(['/dashboard/reports/misreport'], { queryParams: { Schedule_ID, action,ScheduleDate } });
  }

  clear() {
    this.showGrid = false;
    this.branchData = [];
    this.paginatedBranchData = [];
    this.MISTransladerForm.reset({
      FromDate: '',
      ToDate: ''
    });
  }
}

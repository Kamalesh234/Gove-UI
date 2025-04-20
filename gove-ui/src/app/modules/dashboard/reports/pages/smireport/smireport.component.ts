import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { FOSProspectService } from '../../../../../../data/services/feature/prospectMaster/prospects.service';
import { UserManagementService } from '../../../../../../data/services/feature/userManagement/user-management.service';
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { IExistinghSMARequest,IGoveBranchLookup,IFOSLookup,IGoveEMPCodeLookup,IExistinghSMARequestData } from '../../../../../../core/interfaces/app/request/IFOSModels';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-smireport',
  templateUrl: './smireport.component.html',
  styleUrl: './smireport.component.scss'
})
export class SmireportComponent {
  showGrid: boolean = false;
  public showGridSummary:boolean = false;
  branchData: any[] = [];
  summaryData:any[] = [];
  public SMAReportForm: FormGroup;
  public SMAScheduleReportForm : FormGroup;
  userId: string | null = null;
  action: string | null = null;
  schedule:string | null = null;
  public showScheduleForm: boolean = false;
  public showForm :boolean = false;
  public loggedInUser: any = {};
  public genderLookup: IFOSLookup[] = [];
  public branchLookup: IGoveBranchLookup[] = [];
  public empcodeLookup: IGoveBranchLookup[] = [];
  public filteredBranches!: Observable<IGoveBranchLookup[]>;
  public existingNpaDetails: IExistinghSMARequest[] = [];
  public selectEmpCode(evt: any) {}
  constructor(
    private fb: FormBuilder,
    private prospectService: FOSProspectService,
    private router: Router,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportservice: ReportsService,
    private route :ActivatedRoute
  ) {
    // Initialize the form group with FormBuilder
    this.SMAReportForm = this.fb.group({
      Branch: [''],
      SMAType : [''],
      EmployeeCode:[''],
      CutoffDate:['']   
    });
    this.SMAScheduleReportForm = this.fb.group({
      CutoffDate: [{ value: '', disabled: false }]  // Read-only
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['Schedule_ID'] || null;
      this.action = params['action'] || null;
      this.schedule = params['ScheduleDate'] || null;
      if (this.action === 'create') {
        this.showScheduleForm = true;
        this.showGridSummary = false;
        this.showForm = false;

      } else if (this.action === 'view') {
        this.showScheduleForm=false;
        this.showGridSummary = true;
        this.showForm = true;
        this.SMAReportForm.patchValue({ CutoffDate: this.schedule });
        this.Summary();
      } else {
      }
    });
     this.fetAllLookups()
  }

  displayempFieldName(id: any) {
    if (!id) return '';
    let index = this.empcodeLookup.findIndex((state) => state.lookupValueDescription === id);
    return this.empcodeLookup[index].lookupValueDescription;
  }
  fetAllLookups() {
    this.getProspectLookup();
    this.getempcodeLookup();
    this.getBranchLookup();
  }
  
  getBranchLookup() {
      const companyId = this.loggedInUser?.companyId || 1;
      const userID = parseInt(localStorage.getItem('User_ID') || '0', 10);  // Default to 1 if companyId is missing
      const Options = 1;
      this.loaderService.showLoader();
      this.reportservice
        .fetchBranchLookup({
          companyId: companyId,
          userId: userID,
          options: Options
        })
        .subscribe({
          next: (data: any) => {
            this.loaderService.hideLoader();
            if (data && data.message) {
              let lookItems = data.message as IGoveBranchLookup[];
              this.branchLookup = lookItems;
            }
          },
          error: (error: any) => {
            this.loaderService.hideLoader();
            this.toastr.error(error.message, 'Error', { timeOut: 3000 });
          },
        });
    }
  getProspectLookup() {
    this.loaderService.showLoader();
    this.prospectService.fetchProspectLookup().subscribe({
      next: (data: any) => {
        this.loaderService.hideLoader();
        if (data && data.message) {
          let lookItems = data.message as IFOSLookup[];
          this.SetLookups(lookItems);
        }
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toastr.error(error.message, 'Error', { timeOut: 3000 });
      },
    });
  }
  getempcodeLookup() {
    const schedule_ID = Number(this.userId);
    const companyId = this.loggedInUser?.companyId || 1;
      const userID = schedule_ID;  // Default to 1 if companyId is missing
      const Options = 3;
      this.loaderService.showLoader();
      this.reportservice
        .fetchBranchLookup({
          companyId: companyId,
          userId: userID,
          options: Options
        })
        .subscribe({
          next: (data: any) => {
            this.loaderService.hideLoader();
            if (data && data.message) {
              let lookItems = data.message as IGoveBranchLookup[];
              this.empcodeLookup = lookItems;
              this.filteredBranches = this.SMAReportForm
              .get('EmployeeCode')!
              .valueChanges.pipe(
                startWith(''),
                map((value) => this._filterBranches(value!))
              );
            }
          },
          error: (error: any) => {
            this.loaderService.hideLoader();
            this.toastr.error(error.message, 'Error', { timeOut: 3000 });
          },
        });
    }
    private _filterBranches(value: any): IGoveBranchLookup[] {
      if (typeof value != 'string') {
        value = '';
      }
      const filterValue = value.toLowerCase();
  
      return this.empcodeLookup.filter((option: IGoveBranchLookup) =>
        option.lookupValueDescription?.toLowerCase().includes(filterValue)
      );
    }  
  private SetLookups(lookItems: IFOSLookup[]) {
    this.genderLookup = lookItems.filter(
      (s: IFOSLookup) => s.lookupTypeId == 34
    );
 
  }
  Savescheduler(): void {
    if (!this.SMAScheduleReportForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
  
    this.loaderService.showLoader();
  
    const cutoffDateInput = this.SMAScheduleReportForm.value.CutoffDate;
    const companyId = this.loggedInUser?.companyId || 1; // Use dynamic companyId if required
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
  
    this.reportservice
      .fetchSMATransladerdetails({
        userId: userIdAsNumber,
        companyId: companyId,
        branch: "",
        smatype: "",
        employeecode : "",
        cutoffdate: cutoffDateInput,
        schedule_ID:0 ,
        options : 2
      }).subscribe({
      next: (response: any) => {
        if (response) {
          this.toastr.success('Schedule successfully.', 'Success');
        } else {
          this.toastr.warning('No data found for the given Cutoff Date.', 'Warning');
        }
      },
      error: (err: any) => {
        this.toastr.error('Error fetching Schedule details.', 'Error');
      },
      complete: () => {
        this.loaderService.hideLoader();
      }
    });
  }
  
  exportToExcel(): void {
    this.loaderService.showLoader();
    
    const companyId = this.loggedInUser?.companyId || 1; 
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = this.SMAReportForm.value.Branch;
    const SMAType = this.SMAReportForm.value.SMAType;
    let EmpCode = this.SMAReportForm.value.EmployeeCode;
    const schedule_ID = Number(this.userId);
    if (EmpCode && typeof EmpCode === "string") {
    const match = EmpCode.match(/^([A-Z]+-[A-Z]+\d+)-/);
    const extractedCode = match ? match[1] : EmpCode; 
     EmpCode = extractedCode
    } 
    this.reportservice
      .fetchSMATransladerdetails({
        userId: userIdAsNumber,
        companyId: companyId,
        branch: Branch,
        smatype: SMAType,
        employeecode : this.SMAReportForm.value.EmployeeCode,
        cutoffdate: "",
        schedule_ID:schedule_ID,
        options : 1
      })
      .subscribe({
        next: (response: any) => {
          if (response && response.message && response.message.length > 0) {
            const NpareportDetails = response.message; // Array of user objects
            this.existingNpaDetails = NpareportDetails as IExistinghSMARequest[];
            this.SMAReportForm.patchValue({ CutoffDate: this.schedule });
            const cutoffDateInput = this.SMAReportForm.get('CutoffDate')?.value;
            let shtml = `
              <html>
                <head>
                  <title>SMA Reports_${schedule_ID}</title>
                </head>
                <body>
                  <table style="FONT-SIZE: 18px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
                    <tbody>
                      <tr>
                        <th colspan="9" style="text-align:center;">Gove Finance Limited</th>
                      </tr>
                      <tr>
                        <th colspan="9" style="text-align:left;">SMA Report on :- ${cutoffDateInput}</th>
                      </tr>
                      <tr><td colspan="9"></td></tr>
                      <tr>
                        <th>S.No</th>
                        <th>Branch</th>
                        <th>Contract No</th>
                        <th>Name of Hirer</th>
                        <th>Category</th>
                        <th>ProdType</th>
                        <th>Model</th>
                        <th>Due Date</th>
                        <th>Total EMI</th>
                        <th>Current EMI</th>
                        <th>Paid EMI</th>
                        <th>OD</th>
                        <th>EMI</th>
                        <th>Over Due EMI Amount</th>
                        <th>ODC</th>
                        <th>Demand</th>
                        <th>Colln</th>
                        <th>Collectable Amount</th>
                        <th>Executive</th>
                        <th>No Of Days Past Due</th>
                        <th>DMinDt</th>
                        <th>SMA Status</th>
                      </tr>
            `;
      let counter = 1;
            // Add data rows
            NpareportDetails.forEach((user: IExistinghSMARequestData) => {
              shtml += `
                <tr>
                 <td>${counter}</td>
                  <td>${user.Branch || ''}</td>
                  <td>${user.Panum || ''}</td>
                  <td>${user.CustomerName || ''}</td>
                  <td>${user.Category || ''}</td>
                  <td>${user.ProductType || ''}</td>
                  <td>${user.Model || ''}</td>
                  <td>${user.Due_Date || ''}</td>
                  <td>${user.EMI_Count || ''}</td>
                  <td>${user.CurrentEMI || ''}</td>
                  <td>${user.PaidEMI || ''}</td>
                  <td>${user.OverDue || ''}</td>
                  <td>${user.Emiamount || ''}</td>
                  <td>${user.OverDueEMIAmount || ''}</td>
                  <td>${user.ODCharges || ''}</td>
                  <td>${user.Demand || ''}</td>
                  <td>${user.Colln || ''}</td>
                  <td>${user.CollectableAmount || ''}</td>
                  <td>${user.Executive || ''}</td>
                  <td>${user.DPD_Days || ''}</td>
                  <td>${user.DMinDt || ''}</td>
                  <td>${user.SMAStatus || ''}</td>
                </tr>
              `;
              counter++;
            });
  
            shtml += `
                    </tbody>
                  </table>
                </body>
              </html>
            `;
  
            const excelBlob = new Blob([shtml], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
            });
  
            // Trigger file download
            const link = document.createElement('a');
          link.href = URL.createObjectURL(excelBlob);
          link.download = `SMA Reports_${schedule_ID}.xls`; // Note: Use .xls extension for browser compatibility
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          } else {
            this.toastr.error('No Records');
          }
        },
        error: (err: any) => {
          this.toastr.error('Error fetching user details.');
        },
      });
  }
  clearExcel() {   
    this.SMAReportForm.reset({
      Branch: '',
      SMAType : '',
      EmployeeCode:''
    });
  }
  Scheduleclear(){
    this.SMAScheduleReportForm.reset({
      CutoffDate: ''
    });
  }
  Godetails(): void{
    this.showGridSummary = false;
    const branchValue = this.SMAReportForm.value.Branch;
    const employeeCodeValue = this.SMAReportForm.value.EmployeeCode;
    if (!branchValue && !employeeCodeValue) {
      this.toastr.error('Either Branch or Employee Code is required', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
    
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; 
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = this.SMAReportForm.value.Branch;
    const SMAType = this.SMAReportForm.value.SMAType;
    let EmpCode = this.SMAReportForm.value.EmployeeCode;
    const schedule_ID = Number(this.userId);
    if (EmpCode && typeof EmpCode === "string") {
    const match = EmpCode.match(/^([A-Z]+-[A-Z]+\d+)-/);
    const extractedCode = match ? match[1] : EmpCode; 
     EmpCode = extractedCode
    } 
    this.reportservice
    .fetchSMATransladerdetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: Branch,
      smatype: SMAType,
      employeecode : this.SMAReportForm.value.EmployeeCode,
      cutoffdate: "",
      schedule_ID:schedule_ID,
      options : 1
    }).subscribe({
        next: (response: any) => {
          if (response && response.message && response.message.length > 0) {
            this.branchData = response.message; // Assign the response data correctly
            this.showGrid = this.branchData.length > 0; // Show the table only if there is data
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
  Summary():void{
    this.showGrid = false;
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; 
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = this.SMAReportForm.value.Branch;
    const SMAType = this.SMAReportForm.value.SMAType;
    let EmpCode = this.SMAReportForm.value.EmployeeCode;
    const schedule_ID = Number(this.userId);
    if (EmpCode && typeof EmpCode === "string") {
    const match = EmpCode.match(/^([A-Z]+-[A-Z]+\d+)-/);
    const extractedCode = match ? match[1] : EmpCode; 
     EmpCode = extractedCode
    } 
    this.reportservice
    .fetchSMATransladerdetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: Branch,
      smatype: SMAType,
      employeecode : EmpCode,
      cutoffdate: "",
      schedule_ID:schedule_ID,
      options : 4
    }).subscribe({
        next: (response: any) => {
          if (response && response.message && response.message.length > 0) {
            this.summaryData = response.message; // Assign the response data correctly
            this.showGridSummary = this.summaryData.length > 0; // Show the table only if there is data
          } else {
            this.toastr.error('No Records.');
            this.summaryData = [];
            this.showGridSummary = false;
          }
        },
        error: (err: any) => {
          this.toastr.error('Error fetching  details.');
          this.summaryData = [];
          this.showGridSummary = false;
        }
      });
  }
}

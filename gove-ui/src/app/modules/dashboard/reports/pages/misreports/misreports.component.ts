import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { FOSProspectService } from '../../../../../../data/services/feature/prospectMaster/prospects.service';
import { IFOSLookup,IGoveBranchLookup,IExistinghSMARequest,IGoveEMPCodeLookup,
  IExistinghMISRequestData
 } from '../../../../../../core/interfaces/app/request/IFOSModels';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-misreports',
  templateUrl: './misreports.component.html',
  styleUrl: './misreports.component.scss'
})
export class MisreportsComponent {
  public MISForm: FormGroup;
  public MISScheduleReportForm: FormGroup;
  userId: string | null = null;
  action: string | null = null;
  schedule:string | null = null;
  public loggedInUser: any = {};
  public showScheduleForm: boolean = false;
  public showForm :boolean = false;
  public branchLookup: IGoveBranchLookup[] = [];
  public empcodeLookup: IGoveEMPCodeLookup[] = [];
  public filteredBranches!: Observable<IGoveEMPCodeLookup[]>;
  public existingNpaDetails: IExistinghSMARequest[] = [];
  public genderLookup: IFOSLookup[] = [];
  public selectEmpCode(evt: any) {}
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private prospectService: FOSProspectService,    
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportservice: ReportsService,
    private route :ActivatedRoute
  ) {
    this.MISForm = this.fb.group({
      Branch: [''],
      CutoffDate : [''],
      EmployeeCode:[''],
      BucketType:['']
    });
    this.MISScheduleReportForm = this.fb.group({
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
       // this.showGridSummary = false;
        this.showForm = false;

      } else if (this.action === 'view') {
        this.showScheduleForm=false;
       // this.showGridSummary = true;
        this.showForm = true;
        this.MISForm.patchValue({ CutoffDate: this.schedule });
      } else {
      }
    });
     this.fetAllLookups()
  }
  displayempFieldName(id: any) {
    if (!id) return '';
    let index = this.empcodeLookup.findIndex((state) => state.usercode === id);
    return this.empcodeLookup[index].usercode;
  }
  fetAllLookups() {
    this.getempcodeLookup();
    this.getBranchLookup();
    this.getProspectLookup();
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
  getempcodeLookup() {
        this.loaderService.showLoader();
        this.reportservice
          .fetchEMPcodeLookup()
          .subscribe({
            next: (data: any) => {
              this.loaderService.hideLoader();
              if (data && data.message) {
                let lookItems = data.message as IGoveEMPCodeLookup[];
                this.empcodeLookup = lookItems;
                this.filteredBranches = this.MISForm
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
  private SetLookups(lookItems: IFOSLookup[]) {
    this.genderLookup = lookItems.filter(
      (s: IFOSLookup) => s.lookupTypeId == 6
    );

  }
  private _filterBranches(value: any): IGoveEMPCodeLookup[] {
    if (typeof value != 'string') {
      value = '';
    }
    const filterValue = value.toLowerCase();

    return this.empcodeLookup.filter((option: IGoveEMPCodeLookup) =>
      option.usercode?.toLowerCase().includes(filterValue)
    );
  }  
  Savescheduler(): void {
    if (!this.MISScheduleReportForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
  
    this.loaderService.showLoader();
  
    const cutoffDateInput = this.MISScheduleReportForm.value.CutoffDate;
    const companyId = this.loggedInUser?.companyId || 1; // Use dynamic companyId if required
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
  
    this.reportservice
      .fetchMISdetails({
        userId: userIdAsNumber,
        companyId: companyId,
        branch: "",
        maturitytype: "",
        employeecode : "",
        cutoffdate: cutoffDateInput,
        schedule_ID:0 ,
        options : 1
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
  clearExcel() {   
    this.MISForm.reset({
      Branch: '',
      BucketType : '',
      EmployeeCode:''
    });
  }
  exportToExcel(): void {
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; 
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = this.MISForm.value.Branch;
    let EmpCode = this.MISForm.value.EmployeeCode;
    const schedule_ID = Number(this.userId);
    if (EmpCode && typeof EmpCode === "string") {
      const match = EmpCode.match(/^([A-Z]+-[A-Z]+\d+)/);
      const extractedCode = match ? match[1] : EmpCode; 
      EmpCode = extractedCode;
    }
    
    this.reportservice
    .fetchMISdetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: Branch,
      maturitytype: "",
      employeecode :EmpCode,
      cutoffdate: "",
      schedule_ID:schedule_ID,
      options : 3
      })
      .subscribe({
        next: (response: any) => {
          if (response && response.message && response.message.length > 0) {
            const NpareportDetails = response.message; // Array of user objects
            this.existingNpaDetails = NpareportDetails as IExistinghSMARequest[];
            this.MISForm.patchValue({ CutoffDate: this.schedule });
            const cutoffDateInput = this.MISForm.get('CutoffDate')?.value;
            // Construct HTML string for Excel
            let shtml = `
              <html>
                <head>
                  <title>MIS Reports_${this.userId}</title>
                </head>
                <body>
                  <table style="FONT-SIZE: 18px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
                    <tbody>
                      <tr>
                        <th colspan="9" style="text-align:left;">Gove Finance Limited</th>
                      </tr>
                      <tr>
                        <th colspan="9" style="text-align:left;">MIS Report on :- ${cutoffDateInput}</th>
                      </tr>
                      <tr><td colspan="9"></td></tr>
                      <tr>
                        <th>S.No</th>
                        <th>Branch</th>
                        <th>Contract No</th>
                        <th>Disbdt</th>
                        <th>Contdt</th>
                        <th>MatDt</th>
                        <th>Dy</th>
                        <th>ProposalNo</th>
                        <th>FEMIDt</th>
                        <th>Advance/Arrear</th>
                        <th>Ccode</th>
                        <th>Customer Name</th>
                        <th>Customer PanNumber</th>
                        <th>Moratorium</th>
                        <th>RegnNo</th>
                        <th>Category</th>
                        <th>SCategory</th>
                        <th>ManYr</th>
                        <th>ProdType</th>
                        <th>LTVPerc</th>
                        <th>IRR</th>
                        <th>FAAMT</th>
                        <th>FCAMT</th>
                        <th>Lins FA</th>
                        <th>Lins FC</th>
                        <th>DOCCHGS</th>
                        <th>AdminChgs</th>
                        <th>Executive Name</th>
                        <th>Executive Code </th>
                        <th>HypothecatedTo</th>
                        <th>EMICnt</th>
                        <th>PINo</th>
                        <th>ODInstNo</th>
                        <th>CurInstNo</th>
                        <th>EMIAmt</th>
                        <th>ODDays</th>
                        <th>PrinOS</th>
                        <th>IntOs</th>
                        <th>LTDFA</th>
                        <th>LTDFC</th>
                        <th>DFARv</th>
                        <th>DFCRv</th>
                        <th>FFARv</th>
                        <th>FFCRv</th>
                        <th>AdvRd</th>
                        <th>LstRefDt</th>
                        <th>DMinDt</th>
                        <th>PODRv</th>
                        <th>PODCRv</th>
                        <th>PODDays</th>
                         <th>PODCnt</th>
                        <th>ODCRv</th>
                        <th>BCRv</th>
                        <th>LTDODC</th>
                        <th>LTDBC</th>
                        <th>PBCRv</th>
                        <th>Account Status</th>
                        <th>Source</th>
                        <th>SName</th>
                        <th>Payout</th>
                        <th>PSL</th>
                        <th>RiskCatg</th>
                        <th>1to7Days principle</th>
                        <th>1to7Days interest</th>
                        <th>8to14Days principle</th>
                        <th>8to14Days interest</th>
                        <th>15to30Days principle</th>
                        <th>15to30Days interest</th>
                        <th>31to60Days principle</th>
                        <th>31to60Days interest</th>
                        <th>61to90Days principle</th>
                        <th>61to90Days interest</th>
                        <th>91to180Days principle</th>
                        <th>91to180Days interest</th>
                        <th>181to365Days principle</th>
                        <th>181to365Days interest</th>
                        <th>1to3Years principle</th>
                        <th>1to3Years interest</th>
                        <th>3to5Years principle</th>
                        <th>3to5Years interest</th>
                        <th>Morethan5Years principle</th>
                        <th>Morethan5Years interest</th>
                      </tr>
            `;
      let counter = 1;
            // Add data rows
            NpareportDetails.forEach((user: IExistinghMISRequestData) => {
              shtml += `
                <tr>
                 <td>${counter}</td>
                  <td>${user.Branch_Name || ''}</td>
                  <td>${user.Contract_Number || ''}</td>
                  <td>${user.Disb_Date || ''}</td>
                  <td>${user.Contract_Date || ''}</td>
                  <td>${user.Maturity_Date || ''}</td>
                  <td>${user.Due_Date || ''}</td>
                  <td>${user.Proposal_Number || ''}</td>
                  <td>${user.FirstEMI_Date || ''}</td>
                  <td>${user.Advance_Arrear || ''}</td>
                  <td>${user.CCode || ''}</td>
                  <td>${user.Customer_Name || ''}</td>
                  <td>${user.Customer_Pan || ''}</td>
                  <td>${user.Moratorium || ''}</td>
                  <td>${user.REGN_Number || ''}</td>
                  <td>${user.Vehicle_Category || ''}</td>
                  <td>${user.Sub_Category || ''}</td>
                  <td>${user.ManYr || ''}</td>
                  <td>${user.Vehicle_ProductType || ''}</td>
                  <td>${user.LTVPerc || ''}</td>
                  <td>${user.IRR || ''}</td>
                  <td>${user.FAAMT || ''}</td>
                  <td>${user.FCAMT || ''}</td>
                  <td>${user.LinsFA || ''}</td>
                  <td>${user.LinsFC || ''}</td>
                  <td>${user.DOCCHGS || ''}</td>
                  <td>${user.AdminChgs || ''}</td>
                  <td>${user.FieldExecutive_Name || ''}</td>
                  <td>${user.FieldExecutive_Code || ''}</td>
                  <td>${user.HypothecatedTo || ''}</td>
                  <td>${user.EMI_Count || ''}</td>
                  <td>${user.Paid_EMICount || ''}</td>
                  <td>${user.Arrear_EMICount || ''}</td>
                  <td>${user.CurrentMonth_EMI || ''}</td>
                  <td>${user.CurrentMonth_EMIAmount || ''}</td>
                  <td>${user.DPD_Days || ''}</td>
                  <td>${user.Principal_Oustanding || ''}</td>
                  <td>${user.Interest_Outstanding || ''}</td>
                  <td>${user.LTDFA || ''}</td>
                  <td>${user.LTDFC || ''}</td>
                  <td>${user.DFARv || ''}</td>
                  <td>${user.DFCRv || ''}</td>
                  <td>${user.FFARv || ''}</td>
                  <td>${user.FFCRv || ''}</td>
                  <td>${user.AdvRd || ''}</td>
                  <td>${user.Last_receipt_Date || ''}</td>
                  <td>${user.DMinDt || ''}</td>
                  <td>${user.PODRv || ''}</td>
                  <td>${user.PODCRv || ''}</td>
                  <td>${user.PODDays || ''}</td>
                  <td>${user.PODCnt || ''}</td>
                  <td>${user.ODCRv || ''}</td>
                  <td>${user.BCRv || ''}</td>
                  <td>${user.LTDODC || ''}</td>
                  <td>${user.LTDBC || ''}</td>
                  <td>${user.PBCRv || ''}</td>
                  <td>${user.AccountStatus || ''}</td>
                  <td>${user.Source || ''}</td>
                  <td>${user.SName || ''}</td>
                  <td>${user.Payout || ''}</td>
                  <td>${user.PSL || ''}</td>
                  <td>${user.RiskCatg || ''}</td>
                  <td>${user.oneto7Days_principle || ''}</td>
                  <td>${user.oneto7Days_interest || ''}</td>
                  <td>${user.nightto14Days_principle || ''}</td>
                  <td>${user.nightto14Days_interest || ''}</td>
                  <td>${user.d15to30Days_principle || ''}</td>
                  <td>${user.d15to30Days_interest || ''}</td>
                  <td>${user.d31to60Days_principle || ''}</td>
                  <td>${user.d31to60Days_interest || ''}</td>
                  <td>${user.d61to90Days_principle || ''}</td>
                   <td>${user.d61to90Days_interest || ''}</td>
                  <td>${user.d91to180Days_principle || ''}</td>
                  <td>${user.d91to180Days_interest || ''}</td>
                  <td>${user.d181to365Days_principle || ''}</td>
                  <td>${user.d181to365Days_interest || ''}</td>
                  <td>${user.d1to3Years_principle || ''}</td>
                  <td>${user.d1to3Years_interest || ''}</td>
                  <td>${user.d3to5Years_principle || ''}</td>
                  <td>${user.d3to5Years_interest || ''}</td>
                  <td>${user.Morethan5Years_principle || ''}</td>
                  <td>${user.Morethan5Years_interest || ''}</td>                
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
          link.download = `MIS Reports_${this.userId}.xls`; // Note: Use .xls extension for browser compatibility
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
}

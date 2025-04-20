import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { IFOSLookup,IGoveBranchLookup,IExistinghNpahistoryRequestData,IGoveEMPCodeLookup,
  IExistinghNpareportsRequestData
 } from '../../../../../../core/interfaces/app/request/IFOSModels';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-npareport-opertional',
  templateUrl: './npareport-opertional.component.html',
  styleUrl: './npareport-opertional.component.scss'
})
export class NpareportOpertionalComponent {
  public NpaOpertionalForm: FormGroup;
  showGrid: boolean = false;
  public loggedInUser: any = {};
  branchData: any[] = [];
  public branchLookup: IGoveBranchLookup[] = [];
  public empcodeLookup: IGoveEMPCodeLookup[] = [];
  public filteredBranches!: Observable<IGoveEMPCodeLookup[]>;
  public existingNpaDetails: IExistinghNpahistoryRequestData[] = []; // Adjusted type to array
  public existingDetails: IExistinghNpareportsRequestData[] = [];
  showPopup: boolean = false;
  public selectEmpCode(evt: any) {}
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportservice: ReportsService
  ) {
    // Initialize the form group with FormBuilder
    this.NpaOpertionalForm = this.fb.group({
      Branch: [''],
      CutoffDate : [''],
      EmployeeCode:['']
    });
  }
  ngOnInit(): void {
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
                this.filteredBranches = this.NpaOpertionalForm
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
  private _filterBranches(value: any): IGoveEMPCodeLookup[] {
    if (typeof value != 'string') {
      value = '';
    }
    const filterValue = value.toLowerCase();

    return this.empcodeLookup.filter((option: IGoveEMPCodeLookup) =>
      option.usercode?.toLowerCase().includes(filterValue)
    );
  }  
  exportToExcel(): void {
      if (!this.NpaOpertionalForm.get('CutoffDate')?.value) {
        this.toastr.error('Cutoff Date is required.', 'Validation Error', {
          timeOut: 3000,
        });
        return; // Stop execution if Cutoff Date is missing
      }
      this.loaderService.showLoader();
      const companyId = this.loggedInUser?.companyId || 1; 
      const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
      const cutoffDateInput = this.NpaOpertionalForm.value.CutoffDate ;
      const Options = 1; 
      const Accountnumber =  this.NpaOpertionalForm.value.Accountnumber;//  String(this.Accountnumber.value);
      const Branch = '';
      const Segment = '';
      const SubSegment = '';
      
      this.reportservice
        .fetchNpareportdetails({
          userId: userIdAsNumber,
          companyId: companyId,
          cutoffdate:cutoffDateInput,
          accountnumber:Accountnumber,
          branch: Branch,
          segment: Segment,
          subsegment : SubSegment,
          options: Options
        })
        .subscribe({
          next: (response: any) => {
            if (response && response.message && response.message.length > 0) {
              const NpareportDetails = response.message; // Array of user objects
              this.existingNpaDetails = NpareportDetails as IExistinghNpareportsRequestData[];
    
              // Construct HTML string for Excel
              let shtml = `
                <html>
                  <head>
                    <title>NPA Reports</title>
                  </head>
                  <body>
                    <table style="FONT-SIZE: 18px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
                      <tbody>
                        <tr>
                          <th colspan="9" style="text-align:left;">Gove Finance Limited</th>
                        </tr>
                        <tr>
                          <th colspan="9" style="text-align:left;">NPA Report on :- ${new Date(cutoffDateInput).toLocaleDateString()}</th>
                        </tr>
                        <tr><td colspan="9"></td></tr>
                        <tr>
                          <th>NPA Month</th>
                          <th>Panum</th>
                          <th>Branch</th>
                          <th>Customer Code</th>
                          <th>Customer Name</th>
                          <th>Product Type</th>
                          <th>Category</th>
                          <th>PAN Number</th>
                          <th>DMin Dt</th>
                          <th>Lst Refdt</th>
                          <th>DFARv</th>
                          <th>DFCRv</th>
                          <th>FFARv</th>
                          <th>O/S</th>
                          <th>%</th>
                          <th>DPD Days</th>
                          <th>Provision</th>
                          <th>NPA Marked Date</th>
                        </tr>
              `;
   
              // Add data rows
              NpareportDetails.forEach((user: IExistinghNpareportsRequestData) => {
                shtml += `
                  <tr>
                    <td>${user.npA_Month || ''}</td>
                    <td>${user.panum || ''}</td>
                    <td>${user.location_Description || ''}</td>
                    <td>${user.customer_Code || ''}</td>
                    <td>${user.customer_Name || ''}</td>
                    <td>${user.product_Type || ''}</td>
                    <td>${user.category || ''}</td>
                    <td>${user.customer_PAN || ''}</td>
                    <td>${user.arrear_InstallmentStartdate || ''}</td>
                    <td>${user.last_ReceiptDate || ''}</td>
                    <td>${user.arrear_PrincipalAmount || ''}</td>
                    <td>${user.arrear_InterestAmount || ''}</td>
                    <td>${user.future_PrincipalAmount || ''}</td>
                    <td>${user.principal_Outstanding || ''}</td>
                    <td>${user.npA_Percentage || ''}</td>
                    <td>${user.npA_Days || ''}</td>
                    <td>${user.npA_Provision || ''}</td>
                    <td>${user.npA_MarkedDate || ''}</td>
                  </tr>
                `;
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
            link.download = 'NPA_Reports.xls'; // Note: Use .xls extension for browser compatibility
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            } else {
              this.toastr.error('No Records');
            }
          },
          error: (err: any) => {
            this.toastr.error('Error fetching user details.');
            console.error('Error fetching user details:', err);
          },
        });
    }
  clearExcel() {   
    this.showGrid = false;
    this.NpaOpertionalForm.reset({
      Branch: '',
      CutoffDate : '',
      EmployeeCode:''
    });
  }
  SOAexcel(): void {
    if (!this.NpaOpertionalForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; // Replace with dynamic companyId if required
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = String(this.NpaOpertionalForm.value.Branch || '').trim();
    const SubSegment = '';
    const cutoffDateInput = this.NpaOpertionalForm.value.CutoffDate;
    const Options = 4;
    const Accountnumber = ''
    let EmpCode = this.NpaOpertionalForm.value.EmployeeCode;

    if (EmpCode && typeof EmpCode === "string") {
    const match = EmpCode.match(/^([A-Z]+-[A-Z]+\d+)-/);
    const extractedCode = match ? match[1] : EmpCode; 
     EmpCode = extractedCode
    } 
    this.reportservice.fetchNpaSummarydetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: Branch,
      segment: EmpCode,
      subsegment: SubSegment,
      cutoffdate: cutoffDateInput,
      accountnumber: Accountnumber,
      options: Options
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
        this.toastr.error('Error fetching NPA report details.');
        this.branchData = [];
        this.showGrid = false;
      }
    });
    
  }
  logPanum(panum: string) {
    if (!this.NpaOpertionalForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
    this.loaderService.showLoader();
    const cutoffDateInput = this.NpaOpertionalForm.value.CutoffDate;
  
    this.reportservice
      .fetchSOAdetails({
        cutoffdate: cutoffDateInput,
        accountnumber: panum
      })
      .subscribe({
        next: (response: any) => {
          if (response && response.message && response.message.length > 0) {
            const NpareportDetails = response.message; // Array of report data
            this.existingNpaDetails = NpareportDetails as IExistinghNpareportsRequestData[];
  
            // Extract general details from the first record
            const firstRecord = NpareportDetails.find((item: IExistinghNpareportsRequestData) => item.loanAccount_Number);           
            const loanAccount_Number = firstRecord?.loanAccount_Number || '';
            const vehicle_Number = firstRecord?.vehicle_Number || '';
            const branch = firstRecord?.branch || '';
            const customer_Name = firstRecord?.customer_Name || '';
 
            let shtml = `
              <html>
                <head>
                  <title>NPA Reports</title>
                </head>
                <body>
                  <table style="FONT-SIZE: 18px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
                    <tbody>
                      <tr>
                        <th colspan="9" style="text-align:left; padding-left: 250px;">Gove Finance Limited</th>
                      </tr>
                      <tr>
                        <th colspan="9" style="text-align:left;">SOA Details</th>
                      </tr>
                      <tr><td colspan="9"></td></tr>
                      <tr>
                        <th colspan="5" style="text-align:left;">Account Number: ${loanAccount_Number}</th>
                        <th colspan="4" style="text-align:left;">Branch: ${branch}</th>
                      </tr>
                      <tr>
                        <th colspan="5" style="text-align:left;">Vehicle Number: ${vehicle_Number}</th>
                        <th colspan="4" style="text-align:left;">Customer Name: ${customer_Name}</th>
                      </tr>
                      <tr><td colspan="9"></td></tr>
                      <tr>
                        <th colspan="9" style="text-align:left;">Account Outstanding Details</th>
                      </tr>
                      <tr><td colspan="9"></td></tr>
                      <tr>
                        <th>CONTNO</th>
                        <th>DMin Dt</th>
                        <th>Lst Refdt</th>
                        <th>DFARv</th>
                        <th>DFCRv</th>
                        <th>FFARv</th>
                        <th>O/S</th>
                        <th>DPD Days</th>
                        <th>%</th>
                      </tr>
            `;
  
            // Add summary rows
            NpareportDetails.forEach((item: IExistinghNpareportsRequestData) => {
              if (item.contno) { // Check if it's a summary row
                shtml += `
                  <tr>
                    <td>${item.contno || ''}</td>
                    <td>${item.dMinDt || ''}</td>
                    <td>${item.lstRefdt || ''}</td>
                    <td>${item.dfaRv || ''}</td>
                    <td>${item.dfcRv || ''}</td>
                    <td>${item.ffaRv || ''}</td>
                    <td>${item.os || ''}</td>
                    <td>${item.dpD_Days || ''}</td>
                    <td>${item.percteage || ''}</td>
                  </tr>
                `;
              }
            });
  
            shtml += `
                      <tr><td colspan="9"></td></tr>
                      <tr>
                        <th colspan="9" style="text-align:left;">Collection Details as on :- ${new Date(cutoffDateInput).toLocaleDateString()}</th>
                      </tr>
                      <tr><td colspan="9"></td></tr>
                      <tr>
                        <th>INo</th>
                        <th>DueDt</th>
                        <th>Due Amount</th>
                        <th>FARv</th>
                        <th>FCRv</th>
                        <th>RefNo</th>
                        <th>RefDt</th>
                        <th>RefAmt</th>
                        <th>FARd</th>
                        <th>FCRd</th>
                        <th>ODDy</th>
                        <th>ODCRv</th>
                        <th>ODCRd</th>
                        <th>BCRv</th>
                        <th>BCRd</th>
                      </tr>
            `;
  
            // Add installment rows
            NpareportDetails.forEach((item: IExistinghNpareportsRequestData) => {
              if (item.iNo) { // Check if it's an installment row
                shtml += `
                  <tr>
                    <td>${item.iNo || ''}</td>
                    <td>${item.dueDt || ''}</td>
                    <td>${item.dueAmount || ''}</td>
                    <td>${item.faRv || ''}</td>
                    <td>${item.fcRv || ''}</td>
                    <td>${item.refNo || ''}</td>
                    <td>${item.refDt || ''}</td>
                    <td>${item.refAmt || ''}</td>
                    <td>${item.faRd || ''}</td>
                    <td>${item.fcRd || ''}</td>
                    <td>${item.odDy || ''}</td>
                    <td>${item.odcRv || ''}</td>
                    <td>${item.odcRd || ''}</td>
                    <td>${item.bcRv || ''}</td>
                    <td>${item.bcRd || ''}</td>
                  </tr>
                `;
              }
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
            link.download = 'SOA_Reports.xls'; // Using .xls extension for browser compatibility
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            this.toastr.error('No Records');
          }
        },
        error: (err: any) => {
          this.toastr.error('Error fetching details.');
        },
      });
  }

  // closePopup() {
  //   this.showPopup = false;
  // }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { FOSProspectService } from '../../../../../../data/services/feature/prospectMaster/prospects.service';
import { IFOSLookup,IGoveBranchLookup,IExistinghSMARequest,IGoveEMPCodeLookup,
  IExistinghCollectionRequestData
 } from '../../../../../../core/interfaces/app/request/IFOSModels';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-collectionreport',
  templateUrl: './collectionreport.component.html',
  styleUrl: './collectionreport.component.scss'
})
export class CollectionreportComponent {
  public CollectionForm: FormGroup;
  public CollectionScheduleReportForm: FormGroup;
  showGrid: boolean = false;
  userId: string | null = null;
  action: string | null = null;
  schedule:string | null = null;
  public loggedInUser: any = {};
  public showScheduleForm: boolean = false;
  public showForm :boolean = false;
  public branchLookup: IGoveBranchLookup[] = [];
  public empcodeLookup: IGoveEMPCodeLookup[] = [];
  public filteredBranches!: Observable<IGoveEMPCodeLookup[]>;
  public genderLookup: IFOSLookup[] = [];
  public existingNpaDetails: IExistinghSMARequest[] = [];
  public selectEmpCode(evt: any) {}
  public branchData: any[] = [];
  public odData: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private prospectService: FOSProspectService,    
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportservice: ReportsService,
    private route :ActivatedRoute
  ) {
    // Initialize the form group with FormBuilder
    this.CollectionForm = this.fb.group({
      Branch: [''],
      CutoffDate : [''],
      EmployeeCode:[''],
      BucketType:['']
    });
    this.CollectionScheduleReportForm = this.fb.group({
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
        this.CollectionForm.patchValue({ CutoffDate: this.schedule });
       // this.showGridSummary = true;
        this.showForm = true;
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
                this.filteredBranches = this.CollectionForm
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
    if (!this.CollectionScheduleReportForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
  
    this.loaderService.showLoader();
  
    const cutoffDateInput = this.CollectionScheduleReportForm.value.CutoffDate;
    const companyId = this.loggedInUser?.companyId || 1; // Use dynamic companyId if required
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
  
    this.reportservice
      .fetchCollectiondetails({
        userId: userIdAsNumber,
        companyId: companyId,
        branch: "",
        buckettype: "",
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
  exportToExcel(): void {
      this.loaderService.showLoader();
      const companyId = this.loggedInUser?.companyId || 1; 
      const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
      const Branch = this.CollectionForm.value.Branch;
      const BucketType = this.CollectionForm.value.BucketType;
      let EmpCode = this.CollectionForm.value.EmployeeCode;
      const schedule_ID = Number(this.userId);
      if (EmpCode && typeof EmpCode === "string") {
        const match = EmpCode.match(/^([A-Z]+-[A-Z]+\d+)/);
        const extractedCode = match ? match[1] : EmpCode; 
        EmpCode = extractedCode;
      }
      
      this.reportservice
        .fetchCollectiondetails({
          userId: userIdAsNumber,
          companyId: companyId,
          branch: Branch,
          buckettype: BucketType,
          employeecode : EmpCode,
          cutoffdate: "",
          schedule_ID:schedule_ID,
          options : 3
        })
        .subscribe({
          next: (response: any) => {
            if (response && response.message && response.message.length > 0) {
              const NpareportDetails = response.message; // Array of user objects
              this.existingNpaDetails = NpareportDetails as IExistinghSMARequest[];
              this.CollectionForm.patchValue({ CutoffDate: this.schedule });
              const cutoffDateInput = this.CollectionForm.get('CutoffDate')?.value;
              // Construct HTML string for Excel
              let shtml = `
                <html>
                  <head>
                    <title>Collection Reports_${schedule_ID}</title>
                  </head>
                  <body>
                    <table style="FONT-SIZE: 18px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
                      <tbody>
                        <tr>
                          <th colspan="9" style="text-align:centre;">Gove Finance Limited</th>
                        </tr>
                        <tr>
                          <th colspan="9" style="text-align:left;">Collection Report on :- ${cutoffDateInput}</th>
                        </tr>
                        <tr><td colspan="9"></td></tr>
                        <tr>
                          <th>S.No</th>
                          <th>Branch</th>
                          <th>Contract No</th>
                          <th>ProposalNo</th>
                          <th>Name of Hirer</th>
                          <th>Ccode</th>
                          <th>ProdType</th>
                          <th>Category</th>
                          <th>SCategory</th>
                          <th>Dy</th>
                          <th>CONTPERIOD</th>
                          <th>Current EMI</th>
                          <th>Paid EMI</th>
                          <th>Over Due Count</th>
                          <th>ODDays</th>
                          <th>Bucket</th>
                          <th>EMI</th>
                          <th>Over Due EMI Amount</th>
                          <th>ODC</th>
                          <th>Bank Charges</th>
                          <th>Demand</th>
                          <th>Colln</th>
                          <th>Receipt Date</th>
                          <th>Executive Name</th>
                          <th>Executive Code</th>
                          <th>Account Status</th>
                        </tr>
              `;
        let counter = 1;
              // Add data rows
              NpareportDetails.forEach((user: IExistinghCollectionRequestData) => {
                shtml += `
                  <tr>
                   <td>${counter}</td>
                    <td>${user.Branch || ''}</td>
                    <td>${user.Panum || ''}</td>
                    <td>${user.Proposalno || ''}</td>
                    <td>${user.CustomerName || ''}</td>
                    <td>${user.CCode || ''}</td>
                    <td>${user.ProductType || ''}</td>
                    <td>${user.Category || ''}</td>
                    <td>${user.SubCategory || ''}</td>
                    <td>${user.Due_Date || ''}</td>
                    <td>${user.EMI_Count || ''}</td>
                    <td>${user.CurrentEMI || ''}</td>
                    <td>${user.PaidEMI || ''}</td>
                    <td>${user.OverDue || ''}</td>
                    <td>${user.DPD_Days || ''}</td>
                    <td>${user.Bucket || ''}</td>
                    <td>${user.Emiamount || ''}</td>
                    <td>${user.OverDueEMIAmount || ''}</td>
                    <td>${user.ODCharges || ''}</td>
                    <td>${user.Bank_Charges || ''}</td>
                    <td>${user.Demand || ''}</td>
                    <td>${user.CollectableAmount || ''}</td>
                    <td>${user.DMinDt || ''}</td>
                    <td>${user.Executive || ''}</td>
                    <td>${user.FieldExecutive_Code || ''}</td>
                    <td>${user.AccountStatus || ''}</td>
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
            link.download = `Collection Reports_${schedule_ID}.xls`; // Note: Use .xls extension for browser compatibility
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
    this.CollectionForm.reset({
      Branch: '',
      BucketType : '',
      EmployeeCode:''
    });
  }
  Scheduleclear(){
    this.CollectionScheduleReportForm.reset({
      CutoffDate: ''
    });
  }
  summary(): void {
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1;
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = this.CollectionForm.value.Branch;
    const BucketType = this.CollectionForm.value.BucketType;
    let EmpCode = this.CollectionForm.value.EmployeeCode;
    const schedule_ID = Number(this.userId);

    // ✅ Clear OD data at the start
    this.odData = [];

    // Extract Employee Code if needed
    if (EmpCode && typeof EmpCode === "string") {
        const match = EmpCode.match(/^([A-Z]+-[A-Z]+\d+)-/);
        EmpCode = match ? match[1] : EmpCode;
    }

    this.reportservice
        .fetchCollectiondetails({
            userId: userIdAsNumber,
            companyId: companyId,
            branch: Branch,
            buckettype: BucketType,
            employeecode: EmpCode,
            cutoffdate: "",
            schedule_ID: schedule_ID,
            options: 4
        })
        .subscribe({
            next: (response: any) => {
                if (response && response.message && response.message.length > 0) {
                    const NpareportDetails = response.message;

                    const branchGroups: any = {};
                    let totalODCount = 0;
                    let totalOD = 0;
                    let totalODDemand = 0;
                    let totalODPNPA = 0;
                    let totalODPercentage = 0;

                  NpareportDetails.forEach((item: any) => {
                      // ✅ Normalize branch names (case-insensitive)
                      const branchName = item.Branch_Name ? item.Branch_Name.trim().toUpperCase() : null;

                      if (branchName) {
                          if (!branchGroups[branchName]) {
                              branchGroups[branchName] = {
                                  data: [],
                                  totalCount: 0,
                                  totalOD: 0,
                                  totalDemand: 0,
                                  totalPNPA: 0
                              };
                          }

                          // ✅ Add row data for branch
                          branchGroups[branchName].data.push({
                              OD: item.OD || "",
                              Total: item.Total || 0,
                              Null_Records: item.Null_Records || 0,
                              Total_Demand: this.formatAmount(item.Total_Demand) || "",
                              Total_PNPA_Amount: this.formatAmount(item.Total_PNPA_Amount) || "",
                              Percentage: (item.Percentage || "") + "%"
                          });

                          // ✅ Calculate branch totals
                          branchGroups[branchName].totalCount += Number(item.Total || 0);
                          branchGroups[branchName].totalOD += Number(item.Null_Records || 0);
                          branchGroups[branchName].totalDemand += Number(item.Total_Demand || 0);
                          branchGroups[branchName].totalPNPA += Number(item.Total_PNPA_Amount || 0);
                      }

                      // ✅ OD Data Processing (if OD is present but no branch name)
                      if (item.OD && !item.Branch_Name) {
                          totalODCount += Number(item.Total || 0);
                          totalOD += Number(item.Null_Records || 0);
                          totalODDemand += Number(item.Total_Demand || 0);
                          totalODPNPA += Number(item.Total_PNPA_Amount || 0);
                          totalODPercentage += Number(item.Percentage || 0);

                          this.odData.push({
                              OD: item.OD || "",
                              Total: item.Total || 0,
                              Null_Records: item.Null_Records || 0,
                              Total_Demand: this.formatAmount(item.Total_Demand) || "",
                              Total_PNPA_Amount: this.formatAmount(item.Total_PNPA_Amount) || "",
                              Percentage: (item.Percentage || "") + "%"
                          });
                      }
                  });

                  // ✅ Convert to Array for Display
                  this.branchData = Object.keys(branchGroups).map((branchName) => ({
                      branchName,
                      data: branchGroups[branchName].data,
                      totalCount: branchGroups[branchName].totalCount,
                      totalOD: branchGroups[branchName].totalOD,
                      totalDemand: this.formatAmount(branchGroups[branchName].totalDemand),
                      totalPNPA: this.formatAmount(branchGroups[branchName].totalPNPA)
                  }));

                  // ✅ Total for OD Data
                  if (this.odData.length > 0) {
                      this.odData.push({
                          OD: 'Total',
                          Total: totalODCount,
                          Null_Records: totalOD,
                          Total_Demand: this.formatAmount(totalODDemand),
                          Total_PNPA_Amount: this.formatAmount(totalODPNPA),
                          Percentage: "" // No percentage for total row
                      });
                  }

                  this.showGrid = true;
                }

                this.loaderService.hideLoader();
            },
            error: (error: any) => {
                console.error('Error fetching collection details:', error);
                this.loaderService.hideLoader();
            }
        });
}
showSummaryexcel(): void {
  let shtml = `
    <html xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Bucketwise Colln Efficiency_${this.userId}</x:Name>
              <x:WorksheetOptions>
                <x:Panes></x:Panes>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <style>
        body { font-family: Calibri, sans-serif; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px; border: 1px solid #ccc; }
        th { background-color: #173662; color: white; font-weight: bold; text-align: center; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:nth-child(odd) { background-color: #ffffff; }
        .total-row { background-color: yellow; color: black; font-weight: bold; }
        .left-align { text-align: left; }
        .right-align { text-align: right; }
      </style>
    </head>
    <body>
    <table>
      <tr>
        <td style="width: 48%; vertical-align: top;">`;

  // ✅ Add Branch Summary Data (LEFT SIDE)
  if (this.branchData?.length > 0) {
    this.branchData.forEach(branch => {
      shtml += `
        <table>
          <thead>
            <tr>
              <th colspan="6" class="left-align">${branch.branchName || 'Branch'}</th>
            </tr>
            <tr>
              <th class="left-align">OD</th>
              <th class="left-align">No. of Conts</th>
              <th class="left-align">No. of Conts with Nil coll</th>
              <th class="left-align">Demand</th>
              <th class="left-align">Colln. till date</th>
              <th class="left-align">%</th>
            </tr>
          </thead>
          <tbody>`;

      branch.data?.forEach((item: any) => {
        shtml += `
          <tr>
            <td class="right-align">${item.OD || ''}</td>
            <td class="right-align">${item.Total || 0}</td>
            <td class="right-align">${item.Null_Records || ''}</td>
            <td class="right-align">${item.Total_Demand || ''}</td>
            <td class="right-align">${item.Total_PNPA_Amount || ''}</td>
            <td class="right-align">${item.Percentage || ''}</td>
          </tr>`;
      });

      // ✅ Add Total Row for Each Branch
      shtml += `
        <tr class="total-row">
          <td class="right-align">Total</td>
          <td class="right-align">${branch.totalCount || 0}</td>
          <td class="right-align">${branch.totalOD || ''}</td>
          <td class="right-align">${branch.totalDemand || ''}</td>
          <td class="right-align">${branch.totalPNPA || ''}</td>
          <td></td>
        </tr>`;

      shtml += `</tbody></table>`;
    });
  }

  shtml += `</td>
        <td style="width: 4%;"></td>
        <td style="width: 48%; vertical-align: top;">`;

  // ✅ Add OD Summary Data (RIGHT SIDE)
  if (this.odData?.length > 0) {
    shtml += `
      <table>
        <thead>
          <tr>
            <th colspan="6" class="left-align">OD Summary</th>
          </tr>
          <tr>
            <th class="left-align">OD</th>
            <th class="left-align">No. of Conts</th>
            <th class="left-align">No. of Conts with Nil coll</th>
            <th class="left-align">Demand</th>
            <th class="left-align">Colln. till date</th>
            <th class="left-align">%</th>
          </tr>
        </thead>
        <tbody>`;

    this.odData.forEach(item => {
      shtml += `
        <tr>
          <td class="right-align">${item.OD || ''}</td>
          <td class="right-align">${item.Total || 0}</td>
          <td class="right-align">${item.Null_Records || ''}</td>
          <td class="right-align">${item.Total_Demand || ''}</td>
          <td class="right-align">${item.Total_PNPA_Amount || ''}</td>
          <td class="right-align">${item.Percentage || ''}</td>
        </tr>`;
    });

    // ✅ Add Total Row for OD Summary
    // const lastRow = this.odData[this.odData.length - 1];
    // if (lastRow?.OD === 'Total') {
    //   shtml += `
    //     <tr class="total-row">
    //       <td class="right-align">${lastRow.OD || ''}</td>
    //       <td class="right-align">${lastRow.Total || 0}</td>
    //       <td></td>
    //       <td class="right-align">${lastRow.Total_Demand || ''}</td>
    //       <td class="right-align">${lastRow.Total_PNPA_Amount || ''}</td>
    //       <td></td>
    //     </tr>`;
    // }

    shtml += `</tbody></table>`;
  }

  shtml += `
        </td>
      </tr>
    </table>
  </body>
</html>`;

  // ✅ Convert to Blob and Trigger Download
  const excelBlob = new Blob([shtml], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;'
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(excelBlob);
  link.download = `Bucketwise Colln Efficiency_${this.userId}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


  showSummaryClear() {
    this.showGrid = false;
  }
  formatAmount(amount: number | string | null | undefined): string {
    if (!amount || isNaN(Number(amount))) return "0.00"; // Handle null, undefined, or invalid values
    return (Number(amount) / 100000).toFixed(2) ;
   
  }
  onSummaryCollnClick(): void {
    this.loaderService.showLoader();
  
    const userIdAsNumber = parseInt(localStorage.getItem("User_ID") || "0", 10);
    const schedule_ID = Number(this.userId);
  
    this.reportservice
      .fetchCollectiondetails({
        userId: userIdAsNumber,
        companyId: this.loggedInUser?.companyId || 1,
        branch: "",
        buckettype: "",
        employeecode: "",
        cutoffdate: "",
        schedule_ID: schedule_ID,
        options: 5,
      })
      .subscribe({
        next: async (response: any) => {
          if (response && response.message && response.message.length > 0) {
            const NpareportDetails = response.message;
            const uniqueDates = [...new Set(NpareportDetails.map((r: any) => r.Date))].sort();
            if (uniqueDates.length < 2) {
              this.toastr.error("Insufficient data for comparison.");
              return;
            }
  
            const previousMonth: string = String(uniqueDates[0]);
            const currentMonth: string = String(uniqueDates[1]);
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Summary Collection");
  
            // Header Row
            const headerRowData = [
              ["GFL - COLLECTION EFFICIENCY - ACTUAL"],
              ["BRANCH", `${previousMonth}`, "", "", `${currentMonth}`, "", ""],
              ["", "Dem", "Coll", "%", "Dem", "Coll", "%"],
            ];
  
            headerRowData.forEach((row, rowIndex) => {
              const insertedRow = worksheet.addRow(row);
  
              insertedRow.eachCell((cell) => {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "808080" }, // Gray Background
                };
                cell.font = {
                  bold: true,
                  color: { argb: "FFFFFF" },
                  size: 14,
                };
                cell.alignment = { horizontal: "center", vertical: "middle" };
              });
  
              if (rowIndex === 0) {
                worksheet.mergeCells(`A${rowIndex + 1}:G${rowIndex + 1}`);
              }
            });
  
            // Process Data
            const groupedData: Record<string, Record<string, any>> = {};
            NpareportDetails.forEach((record: any) => {
              const branch = record.Branch_Name;
              if (!groupedData[branch]) {
                groupedData[branch] = {};
              }
              groupedData[branch][record.Date] = {
                Demand: this.formatAmount(record.Demand) || "0.00",
                Colln: this.formatAmount(record.Colln) || "0.00",
                "%": (record["%"] || 0), 
              };
            });
  
            let totalDemPrev = 0,
              totalCollPrev = 0,
              totalDemCurr = 0,
              totalCollCurr = 0;
  
            Object.keys(groupedData).forEach((branch) => {
              const branchData = groupedData[branch] || {};
              const prevData = branchData[previousMonth] || { Demand: "0.00", Colln: "0.00", "%": 0 };
              const currData = branchData[currentMonth] || { Demand: "0.00", Colln: "0.00", "%": 0 };
  
              totalDemPrev += parseFloat(prevData.Demand);
              totalCollPrev += parseFloat(prevData.Colln);
              totalDemCurr += parseFloat(currData.Demand);
              totalCollCurr += parseFloat(currData.Colln);
  
              worksheet.addRow([
                branch,
                prevData.Demand,
                prevData.Colln,
                `${prevData["%"].toFixed(2)}%`,
                currData.Demand,
                currData.Colln,
                `${currData["%"].toFixed(2)}%`,
              ]);
            });
  
            // Calculate Total Efficiency
            const totalEfficiencyPrev = totalDemPrev > 0 ? (totalCollPrev / totalDemPrev) * 100 : 0;
            const totalEfficiencyCurr = totalDemCurr > 0 ? (totalCollCurr / totalDemCurr) * 100 : 0;
  
            // Total Row
            const totalRow = worksheet.addRow([
              "Total",
              totalDemPrev.toFixed(2),
              totalCollPrev.toFixed(2),
              `${totalEfficiencyPrev.toFixed(2)}%`,
              totalDemCurr.toFixed(2),
              totalCollCurr.toFixed(2),
              `${totalEfficiencyCurr.toFixed(2)}%`,
            ]);
  
            totalRow.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "E2EFDA" },
              };
              cell.font = { bold: true };
            });
  
            // Adjust Column Widths
            worksheet.columns = [
              { width: 20 }, // Branch
              { width: 12 }, { width: 12 }, { width: 10 }, // Previous Month
              { width: 12 }, { width: 12 }, { width: 10 }, // Current Month
            ];
  
            // Save the Excel File
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, `Summary_Collection_Report_${this.userId}.xlsx`);
  
            this.loaderService.hideLoader();
          } else {
            this.toastr.error("No Records Found.");
            this.loaderService.hideLoader();
          }
        },
        error: (err: any) => {
          this.toastr.error("Error fetching user details.");
          this.loaderService.hideLoader();
        },
      });
  }
  async onSummaryDueClick(): Promise<void> {
    this.loaderService.showLoader();

    try {
        const userIdAsNumber = parseInt(localStorage.getItem("User_ID") || "0", 10);
        const schedule_ID = Number(this.userId);

        const response = await this.reportservice.fetchCollectiondetails({
            userId: userIdAsNumber,
            companyId: this.loggedInUser?.companyId || 1,
            branch: "",
            buckettype: "",
            employeecode: "",
            cutoffdate: "",
            schedule_ID: schedule_ID,
            options: 6,
        }).toPromise();

        if (!response || !response.message || response.message.length === 0) {
            this.toastr.error("No Records Found.");
            return;
        }

        const NpareportDetails: Array<{
            Branch_Name: string;
            vehicle_Category: string;
            SubCategory: string;
            Date: string;
            Demand: number;
            Colln: number;
            "%": number;
        }> = response.message;

        // Normalize Branch Names to avoid case sensitivity issues
        NpareportDetails.forEach((record) => {
            record.Branch_Name = record.Branch_Name.trim().toUpperCase();
        });

        // Extract unique dates dynamically
        const uniqueDates = [...new Set(NpareportDetails.map((r) => r.Date))].sort();

        if (uniqueDates.length < 1) {
            this.toastr.error("Insufficient data for comparison.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Summary Due");

        // Define Header
        const headerRowData = [
            ["GFL - CATEGORY WISE COLLECTION (In Lakhs)"],
            ["Branch Name", ...uniqueDates.flatMap((date) => [date, "", ""])],
            ["", ...uniqueDates.flatMap(() => ["Dem", "Coll", "%"])],
        ];

        headerRowData.forEach((row, rowIndex) => {
          const insertedRow = worksheet.addRow(row);
      
          insertedRow.eachCell((cell, colNumber) => {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
              cell.font = { bold: true, color: { argb: "FFFFFF" }, size: rowIndex === 0 ? 16 : 12 }; // Set larger font for title row
              cell.alignment = { horizontal: "center", vertical: "middle" };
          });
      
          // Merge the first row across all columns for a centered title
          if (rowIndex === 0) {
              worksheet.mergeCells(insertedRow.number, 1, insertedRow.number, uniqueDates.length * 3 + 1);
          }
      });
        // Process Data with Hierarchical Grouping
        const groupedData: Record<string, Record<string, Record<string, Record<string, any>>>> = {};
        const branchTotals: Record<string, Record<string, { Demand: number; Colln: number }>> = {};

        NpareportDetails.forEach((record) => {
            const { Branch_Name, vehicle_Category, SubCategory, Date, Demand, Colln } = record;

            if (!groupedData[Branch_Name]) groupedData[Branch_Name] = {};
            if (!groupedData[Branch_Name][vehicle_Category]) groupedData[Branch_Name][vehicle_Category] = {};
            if (!groupedData[Branch_Name][vehicle_Category][SubCategory]) groupedData[Branch_Name][vehicle_Category][SubCategory] = {};
            if (!branchTotals[Branch_Name]) branchTotals[Branch_Name] = {};

            if (!branchTotals[Branch_Name][Date]) {
                branchTotals[Branch_Name][Date] = { Demand: 0, Colln: 0 };
            }

            branchTotals[Branch_Name][Date].Demand += Demand;
            branchTotals[Branch_Name][Date].Colln += Colln;

            groupedData[Branch_Name][vehicle_Category][SubCategory][Date] = {
                Demand: this.formatAmount(Demand) || "0.00",
                Colln: this.formatAmount(Colln) || "0.00",
                "%": `${(record["%"] || 0).toFixed(2)}%`
            };
        });

        Object.keys(groupedData).forEach((branch) => {
            const branchRow = worksheet.addRow([branch, ...Array(uniqueDates.length * 3).fill("")]);
            branchRow.getCell(1).font = { bold: true };

            Object.keys(groupedData[branch]).forEach((category) => {
                const categoryRow = worksheet.addRow([category, ...Array(uniqueDates.length * 3).fill("")]);
                categoryRow.getCell(1).font = { italic: true };

                Object.keys(groupedData[branch][category]).forEach((subCategory) => {
                    const rowValues = [`   ${subCategory}`, ...Array(uniqueDates.length * 3).fill("")];

                    uniqueDates.forEach((Date, index) => {
                        const data = groupedData[branch][category][subCategory][Date] || { Demand: "", Colln: "", "%": "" };
                        rowValues[index * 3 + 1] = data.Demand;
                        rowValues[index * 3 + 2] = data.Colln;
                        rowValues[index * 3 + 3] = data["%"];
                    });

                    worksheet.addRow(rowValues);
                });
            });

            // Add **Branch Total Row**
            const totalRowValues = [`Total`, ...Array(uniqueDates.length * 3).fill("")];

            uniqueDates.forEach((Date, index) => {
                const totalData = branchTotals[branch][Date] || { Demand: 0, Colln: 0 };
                totalRowValues[index * 3 + 1] = this.formatAmount(totalData.Demand);
                totalRowValues[index * 3 + 2] = this.formatAmount(totalData.Colln);
                totalRowValues[index * 3 + 3] =
                    totalData.Demand > 0 ? `${((totalData.Colln / totalData.Demand) * 100).toFixed(0)}%` : "0%";
            });

            const totalRow = worksheet.addRow(totalRowValues);
            totalRow.eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D3D3D3" } };
            });
        });

        // Adjust Column Widths
        worksheet.columns = [
            { width: 25 },
            ...uniqueDates.flatMap(() => [{ width: 12 }, { width: 12 }, { width: 8 }]),
        ];

        // Save File
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `Summary_Due_Report_${this.userId}.xlsx`);

        this.loaderService.hideLoader();
    } catch (error) {
        this.toastr.error("Error fetching data.");
        this.loaderService.hideLoader();
    }
}

}
interface CollectionData {
  Demand: number;
  Colln: number;
  "%": number;
}

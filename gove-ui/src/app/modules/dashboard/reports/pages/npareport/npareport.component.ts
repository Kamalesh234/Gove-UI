import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { FOSProspectService } from '../../../../../../data/services/feature/prospectMaster/prospects.service';
import { UserManagementService } from '../../../../../../data/services/feature/userManagement/user-management.service';
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { IExistinghNpareportsRequestData,IFOSLookup,IGoveBranchLookup } from '../../../../../../core/interfaces/app/request/IFOSModels';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-npareport',
  templateUrl: './npareport.component.html',
  styleUrls: ['./npareport.component.scss'], // Fixed 'styleUrl' to 'styleUrls'
  providers: [DatePipe] 
})
export class NpareportComponent {
  showSummaryButton = true; 

  // Accountnumber = new FormControl('');
  // accountNumbers: string[] = ['LHOS23010079', 'ACC67890', 'ACC11223', 'ACC44556']; // Sample data, replace with API call
  // filteredAccountNumbers!: Observable<string[]>;
  public NpaReportForm: FormGroup;
  showGrid: boolean = false;
  selectedBranch: string = ''; 
  selectedSegment: string = '';
  selectedSubSegment:string='';
  selectedDenomination: string = "";
  filteredBranchData: any[] = [];
  filteredSegmentData: any[] = [];
  filteredSubsegmentData: any[] = [];
  summarybranchData: any[] = [];
  branchData: any[] = []; // Declare the branchData property
  segmentData: any[] = []; // Declare the segmentData property
  subsegmentData: any[] = []; 
  public isSubmitted: boolean = false;
  public loggedInUser: any = {};
  public denominationLookup:IFOSLookup[] =[];
  public genderLookup: IFOSLookup[] = [];
  public branchLookup: IGoveBranchLookup[] = [];
  public categoryLookup: IGoveBranchLookup[] = [];
  public existingNpaDetails: IExistinghNpareportsRequestData[] = []; // Adjusted type to array


  constructor(
    private fb: FormBuilder,
    private prospectService: FOSProspectService,
    private router: Router,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private userManagementService: UserManagementService,
    private reportservice: ReportsService,
    private datePipe: DatePipe
  ) {
    // Initialize the form group with FormBuilder
    this.NpaReportForm = this.fb.group({
      Branch: [''],
      Segment:[''],
      SubSegment:[''],
      Accountnumber: [''],
      CutoffDate : [''],
      Denomination:['']
    });
  }
  ngOnInit(): void {
    this.fetAllLookups(),
    (jsPDF as any).API.autoTable = autoTable;
    // this.filteredAccountNumbers = this.Accountnumber.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || ''))
    // );
  }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toUpperCase(); // Convert input to uppercase
  //   this.Accountnumber.setValue(filterValue, { emitEvent: false }); // ✅ Correct way to update FormControl value
  //   return this.accountNumbers.filter(acc => acc.toUpperCase().includes(filterValue));
  // }
  
  fetAllLookups() {
    this.getProspectLookup();
    this.getBranchLookup();
    this.getcategoryLookup();
    this.filterTableData();
  }

  private SetLookups(lookItems: IFOSLookup[]) {
    this.genderLookup = lookItems.filter(
      (s: IFOSLookup) => s.lookupTypeId == 3
    );
    this.denominationLookup = lookItems.filter(
      (s: IFOSLookup) => s.lookupTypeId == 4
    );
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
  getcategoryLookup() {
    const companyId = this.loggedInUser?.companyId || 1;
    const userID = parseInt(localStorage.getItem('User_ID') || '0', 10); // Default to 1 if companyId is missing
    const Options = 2;
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
            this.categoryLookup = lookItems;
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
          //localStorage.setItem('lookups', JSON.stringify(lookItems));
          this.SetLookups(lookItems);
        }
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toastr.error(error.message, 'Error', { timeOut: 3000 });
      },
    });
  }
  exportToExcel(): void {
    if (!this.NpaReportForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return; // Stop execution if Cutoff Date is missing
    }
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; 
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const cutoffDateInput = this.NpaReportForm.value.CutoffDate ;
    const Options = 1; 
    const Accountnumber =  this.NpaReportForm.value.Accountnumber;//  String(this.Accountnumber.value);
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
  

  transformDate(date: string | Date): string {
    const parsedDate = date instanceof Date ? date : new Date(date);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    return parsedDate.toLocaleDateString('en-GB', options); // Format as DD/MM/YYYY
  }

  private downloadExcel(buffer: any, fileName: string): void {
    const blob: Blob = new Blob([buffer], { type: 'application/octet-stream' });

    // Trigger file download
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
  showSummaryClear():void{
    this.showGrid = false;
    this.selectedBranch = ''; 
  this.selectedSegment = '';
  this.selectedSubSegment = '';
  this.selectedDenomination = '';

  this.filteredBranchData = [];
  this.filteredSegmentData = [];
  this.filteredSubsegmentData = [];

  this.NpaReportForm.reset({
    Branch: '',
    Segment: '',  
    SubSegment: '',
    Accountnumber: '',
    CutoffDate: '',
    Denomination: ''
  });
  }
  
  showSummary(): void {
    if (!this.NpaReportForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return; // Stop execution if Cutoff Date is missing
    }
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; // Replace with dynamic companyId if required
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = String(this.NpaReportForm.value.Branch || '').trim();
    const Segment = String(this.NpaReportForm.value.Segment || '').trim();
    const SubSegment = String(this.NpaReportForm.value.SubSegment || '').trim();
    const cutoffDateInput = this.NpaReportForm.value.CutoffDate;
    const Options = 2;
    const Accountnumber = this.NpaReportForm.value.Accountnumber ;//String(this.Accountnumber.value);
  
    this.reportservice.fetchNpaSummarydetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: Branch,
      segment: Segment,
      subsegment: SubSegment,
      cutoffdate: cutoffDateInput,
      accountnumber: Accountnumber,
      options: Options
    }).subscribe({
      next: (response: any) => {
        if (response && response.message && response.message.length > 0) {
          const NpareportDetails = response.message; // Array of user objects
          let totalBranchCount=0,totalBranchGrossNPA = 0, totalBranchProvisions = 0,totalBranchNetNPA = 0, totalBranchAUM = 0;
          let totalSegmentCount=0,totalSegmentGrossNPA = 0, totalSegmentProvisions = 0,totalSegmentNetNPA = 0, totalSegmentAUM = 0;
          let totalSubSegmentCount=0,totalSubsegmentGrossNPA = 0, totalSubsegmentProvisions = 0,totalSubsegmentNetNPA = 0, totalSubsegmentAUM = 0;
  
          // Process the NpareportDetails and calculate totals
          this.summarybranchData = NpareportDetails.map((item: any) => {
            if (item.branch) {
              totalBranchCount += Number(item.branch_count || 0);
              totalBranchGrossNPA += Number(item.branch_GrossNPA || 0);
              totalBranchProvisions += Number(item.branch_Provisions || 0);
              totalBranchNetNPA += Number(item.branch_NetNPA || 0);
              totalBranchAUM += Number(item.branch_AUM || 0);
              return {
                Type: "Branch",
                summary_Branch: item.branch || "",
                branch_Count: item.branch_count || "",
                branch_GrossNPA: this.formatAmount(item.branch_GrossNPA) || "",
                branch_Provisions: this.formatAmount(item.branch_Provisions) || "",
                branch_NetNPA: this.formatAmount(item.branch_NetNPA) || "",
                branch_AUM:this.formatAmount (item.branch_AUM )|| "",
                branch_GNPA: item.branch_GNPA + "%" || "",
                branch_NNPA: item.branch_NNPA + "%" || ""
              };
            } else if (item.segment) {
              totalSegmentCount += Number(item.segment_count || 0);
              totalSegmentGrossNPA += Number(item.segment_GrossNPA || 0);
              totalSegmentProvisions += Number(item.segment_Provisions || 0);
              totalSegmentNetNPA += Number(item.segment_NetNPA || 0);
              totalSegmentAUM += Number(item.segment_AUM || 0);
              return {
                Type: "Segment",
                summary_Segment: item.segment || "",
                segment_Count: item.segment_count || "",
                segment_GrossNPA: this.formatAmount(item.segment_GrossNPA) || "",
                segment_Provisions: this.formatAmount(item.segment_Provisions) || "",
                segment_NetNPA: this.formatAmount(item.segment_NetNPA) || "",
                segment_AUM: this.formatAmount(item.segment_AUM) || "",
                segment_GNPA: item.segment_GNPA + "%" || "",
                segment_NNPA: item.segment_NNPA + "%" || ""
              };
            } else if (item.subsegment) {
              totalSubSegmentCount += Number(item.subsegment_count || 0);
              totalSubsegmentGrossNPA += Number(item.subsegment_GrossNPA || 0);
              totalSubsegmentProvisions += Number(item.subsegment_Provisions || 0);
              totalSubsegmentNetNPA += Number(item.subsegment_NetNPA || 0);
              totalSubsegmentAUM += Number(item.subsegment_AUM || 0);
              return {
                Type: "SubSegment",
                summary_Subsegment: item.subsegment || "",
                subsegment_Count: item.subsegment_count || "", 
                subsegment_GrossNPA: this.formatAmount(item.subsegment_GrossNPA) || "",
                subsegment_Provisions: this.formatAmount(item.subsegment_Provisions) || "",
                subsegment_NetNPA: this.formatAmount(item.subsegment_NetNPA) || "",
                subsegment_AUM: this.formatAmount(item.subsegment_AUM) || "",
                subsegment_GNPA: item.subsegment_GNPA + "%" || "",
                subsegment_NNPA: item.subsegment_NNPA + "%" || ""
              };
            }
            return null; // Exclude invalid entries
          });
  
          // Add totals for Branches, Segments, and Subsegments
          this.summarybranchData.push({
            Type: "Branch",
            summary_Branch: "Total",
            branch_Count: totalBranchCount,
            branch_GrossNPA: this.formatAmount(totalBranchGrossNPA),
            branch_Provisions: this.formatAmount(totalBranchProvisions),
            branch_NetNPA: this.formatAmount(totalBranchNetNPA),
            branch_AUM: this.formatAmount(totalBranchAUM),
          });
  
          this.summarybranchData.push({
            Type: "Segment",
            summary_Segment: "Total",
            segment_Count: totalSegmentCount,
            segment_GrossNPA: this.formatAmount(totalSegmentGrossNPA),
            segment_Provisions: this.formatAmount(totalSegmentProvisions),
            segment_NetNPA: this.formatAmount(totalSegmentNetNPA),
            segment_AUM: this.formatAmount(totalSegmentAUM),
          });
  
          this.summarybranchData.push({
            Type: "SubSegment",
            summary_Subsegment: "Total",
            subsegment_Count: totalSubSegmentCount,
            subsegment_GrossNPA: this.formatAmount(totalSubsegmentGrossNPA),
            subsegment_Provisions: this.formatAmount(totalSubsegmentProvisions),
            subsegment_NetNPA: this.formatAmount(totalSubsegmentNetNPA),
            subsegment_AUM: this.formatAmount(totalSubsegmentAUM),
          });
          this.filteredBranchData = this.summarybranchData.filter(item => item.Type === 'Branch');
          this.filteredSegmentData = this.summarybranchData.filter(item => item.Type === 'Segment');
          this.filteredSubsegmentData = this.summarybranchData.filter(item => item.Type === 'SubSegment')
          // Separate the data into Branch, Segment, and Subsegment categories
          this.branchData = this.summarybranchData.filter(item => item.Type === 'Branch');
          this.segmentData = this.summarybranchData.filter(item => item.Type === 'Segment');
          this.subsegmentData = this.summarybranchData.filter(item => item.Type === 'SubSegment');
  
          // Display the data
          this.showGrid = this.summarybranchData.length > 0;
        } else {
          this.toastr.error('No Records.');
          this.showGrid = false;
        }
      },
      error: (err: any) => {
        this.toastr.error('Error fetching NPA report details.');
        this.showGrid = false;
      }
    });
  }
  showSummaryPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    const text = "Gove Finance Limited";
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(text);
    const xPosition = (pageWidth - textWidth) / 2;

    let formattedDate = "N/A";
    const cutoffDate = this.NpaReportForm?.value?.CutoffDate;

    if (cutoffDate) {
        const dateParts = cutoffDate.split("-");
        if (dateParts.length === 3) {
            const date = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
            formattedDate = date.toLocaleDateString('en-GB', options).replace(" ", "- ");
        }
    }

    doc.text(text, xPosition, 15);
    doc.setFontSize(10);
    doc.text(`NPA Summary Details on: ${formattedDate}`, 15, 22);
    const selectedOption = this.denominationLookup.find(c => c.lookupValueId == this.NpaReportForm.value.Denomination);
     const denominationText = `Denomination :- Amount in ${selectedOption ? selectedOption.lookupValueDescription : "Lakhs"}`;
    const pageWidth1 = doc.internal.pageSize.width; // Get page width
    const textWidth1 = doc.getTextWidth(denominationText); // Get text width
    const xPosition1 = pageWidth1 - textWidth1 - 15; // Align text to the right
    doc.text(denominationText, xPosition1, 22);
     let y = 25;

    // Generic function to add tables
    const addTable = (data: any[], columns: string[], keys: string[]) => {
        if (data && data.length > 0) {
            autoTable(doc, {
                head: [columns],
                body: data.map((item, index) => [
                    item[keys[0]] === 'Total' ? '' : index + 1,
                    item[keys[0]] || '',
                    item[keys[1]] || '',
                    item[keys[2]] || '',
                    item[keys[3]] || '',
                    item[keys[4]] || '',
                    item[keys[5]] || '',
                    item[keys[6]] || '',
                    item[keys[7]] || ''
                ]),
                startY: y,
                styles: { fontSize: 8, cellPadding: 2, halign: 'center', valign: 'middle' },
                theme: 'grid',
                headStyles: { fillColor: [23, 54, 98], textColor: 255, fontStyle: 'bold', halign: 'center' },
                columnStyles: {
                    1: { halign: 'left' },
                    2: { halign: 'right' },
                    3: { halign: 'right' },
                    4: { halign: 'right' },
                    5: { halign: 'right' },
                    6: { halign: 'right' },
                    7: { halign: 'right' },
                    8: { halign: 'right' }
                }
            });

            // Update Y position
            const finalY = (doc as any).lastAutoTable?.finalY || y + 10;
            y = finalY + 10;

            // Add new page if needed
            if (y + 40 > doc.internal.pageSize.height) {
                doc.addPage();
                y = 15;
            }
        }
    };

    // Add tables with correct data keys
    addTable(this.branchData, ['S.NO', 'Branch', 'Count', 'Gross NPA', 'Provisions','Net NPA', 'AUM', 'GNPA%', 'NNPA%'], 
             ['summary_Branch', 'branch_Count', 'branch_GrossNPA', 'branch_Provisions','branch_NetNPA', 'branch_AUM', 'branch_GNPA', 'branch_NNPA']);
    
    addTable(this.segmentData, ['S.NO', 'Segment', 'Count', 'Gross NPA', 'Provisions','Net NPA', 'AUM', 'GNPA%', 'NNPA%'], 
             ['summary_Segment', 'segment_Count', 'segment_GrossNPA', 'segment_Provisions','segment_NetNPA', 'segment_AUM', 'segment_GNPA', 'segment_NNPA']);
    
    addTable(this.subsegmentData, ['S.NO', 'Subsegment', 'Count', 'Gross NPA', 'Provisions','Net NPA', 'AUM', 'GNPA%', 'NNPA%'], 
             ['summary_Subsegment', 'subsegment_Count', 'subsegment_GrossNPA', 'subsegment_Provisions','subsegment_NetNPA', 'subsegment_AUM', 'subsegment_GNPA', 'subsegment_NNPA']);

    // Footer
    const currentDate = new Date();
    const formattedPrintDate = currentDate.toLocaleDateString('en-GB');
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text(`Printed on: ${formattedPrintDate}`, 15, pageHeight - 10);

    doc.save('NPA_Summary_Report.pdf');
  }

  showSummaryexcel(): void {
    let shtml = `
    <html>
      <head>
        <title>NPA Reports</title>
      </head>
      <body>
        <h3>Gove Finance Limited</h3>
        <h4>NPA Summary Details </h4>
  
        <!-- Branch Table -->
        <table style="FONT-SIZE: 24px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Branch</th>
              <th>Count</th>
              <th>Gross NPA</th>
              <th>Provisions</th>
              <th>Net NPA</th>
              <th>AUM</th>
              <th>GNPA%</th>
              <th>NNPA%</th>
            </tr>
          </thead>
          <tbody>`;
  
    // Branch Data
    this.branchData.forEach((item, index) => {
      shtml += `
        <tr style="${item.summary_Branch === 'Total' ? 'background-color: yellow; color: black; font-weight: bold;' : ''}">
          <td>${item.summary_Branch === 'Total' ? '' : index + 1}</td>
          <td>${item.summary_Branch || ''}</td>
          <td>${item.branch_Count || ''}</td>
          <td>${item.branch_GrossNPA || ''}</td>
          <td>${item.branch_Provisions || ''}</td>
          <td>${item.branch_NetNPA || ''}</td>
          <td>${item.branch_AUM || ''}</td>
          <td>${item.branch_GNPA || ''}</td>
          <td>${item.branch_NNPA || ''}</td>
        </tr>`;
    });
  
    shtml += `</tbody></table><br/>`;
  
    // Segment Table
    shtml += `
      <table style="FONT-SIZE: 24px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Segment</th>
            <th>Count</th>
            <th>Gross NPA</th>
            <th>Provisions</th>
            <th>Net NPA</th>
            <th>AUM</th>
            <th>GNPA%</th>
            <th>NNPA%</th>
          </tr>
        </thead>
        <tbody>`;
  
    // Segment Data
    this.segmentData.forEach((item, index) => {
      shtml += `
        <tr style="${item.summary_Segment === 'Total' ? 'background-color: yellow; color: black; font-weight: bold;' : ''}">
          <td>${item.summary_Segment === 'Total' ? '' : index + 1}</td>
          <td>${item.summary_Segment || ''}</td>
          <td>${item.segment_Count || ''}</td>
          <td>${item.segment_GrossNPA || ''}</td>
          <td>${item.segment_Provisions || ''}</td>
          <td>${item.segment_NetNPA || ''}</td>
          <td>${item.segment_AUM || ''}</td>
          <td>${item.segment_GNPA || ''}</td>
          <td>${item.segment_NNPA || ''}</td>
        </tr>`;
    });
  
    shtml += `</tbody></table><br/>`;
  
    // Subsegment Table
    shtml += `
      <table style="FONT-SIZE: 24px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Subsegment</th>
            <th>Count</th>
            <th>Gross NPA</th>
            <th>Provisions</th>
            <th>Net NPA</th>
            <th>AUM</th>
            <th>GNPA%</th>
            <th>NNPA%</th>
          </tr>
        </thead>
        <tbody>`;
  
    // Subsegment Data
    this.subsegmentData.forEach((item, index) => {
      shtml += `
        <tr style="${item.summary_Subsegment === 'Total' ? 'background-color: yellow; color: black; font-weight: bold;' : ''}">
          <td>${item.summary_Subsegment === 'Total' ? '' : index + 1}</td>
          <td>${item.summary_Subsegment || ''}</td>
          <td>${item.subsegment_Count || ''}</td>
          <td>${item.subsegment_GrossNPA || ''}</td>
          <td>${item.subsegment_Provisions || ''}</td>
          <td>${item.subsegment_NetNPA || ''}</td>
          <td>${item.subsegment_AUM || ''}</td>
          <td>${item.subsegment_GNPA || ''}</td>
          <td>${item.subsegment_NNPA || ''}</td>
        </tr>`;
    });
  
    shtml += `</tbody></table></body></html>`;
  
    // Create a Blob for the generated HTML
    const excelBlob = new Blob([shtml], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
    });
  
    // Trigger the file download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(excelBlob);
    link.download = 'NPA_Summary_Report.xls'; // Use .xls for Excel compatibility
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  closeSummary() {
    this.branchData = [];
    this.segmentData = [];
    this.subsegmentData = [];
    this.showGrid = false;
    this.selectedBranch = ''; 
  this.selectedSegment = '';
  this.selectedSubSegment = '';
  this.selectedDenomination = '';

  this.filteredBranchData = [];
  this.filteredSegmentData = [];
  this.filteredSubsegmentData = [];

  this.NpaReportForm.reset({
    Branch: '',
    Segment: '',  
    SubSegment: '',
    Accountnumber: '',
    CutoffDate: '',
    Denomination: ''
  });
  }
  clearExcel() {
  this.selectedBranch = ''; 
  this.selectedSegment = '';
  this.selectedSubSegment = '';
  this.selectedDenomination = '';

  this.filteredBranchData = [];
  this.filteredSegmentData = [];
  this.filteredSubsegmentData = [];

  this.NpaReportForm.reset({
    Branch: '',
    Segment: '',  
    SubSegment: '',
    Accountnumber: '',
    CutoffDate: '',
    Denomination: ''
  });
  }

  exportToSOA(): void {
    if (!this.NpaReportForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
    if (!this.NpaReportForm.get('Accountnumber')?.value) {
      this.toastr.error('Account number is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
  
    this.loaderService.showLoader();
    const cutoffDateInput = this.NpaReportForm.value.CutoffDate;
    const accountNumber = this.NpaReportForm.value.Accountnumber;
  
    this.reportservice
      .fetchSOAdetails({
        cutoffdate: cutoffDateInput,
        accountnumber: accountNumber
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
          this.toastr.error('Error fetching SOA details.');
          console.error('Error fetching SOA details:', err);
        },
      });
  }
  
  filterTableData() : void {
  this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; // Replace with dynamic companyId if required
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = this.selectedBranch ? this.selectedBranch.trim() : '';
    const Segment = this.selectedSegment ? this.selectedSegment.trim() : '';
    const SubSegment = this.selectedSubSegment ? this.selectedSubSegment.trim() : '';
    const cutoffDateInput = this.NpaReportForm.value.CutoffDate;
    const Options = 2;
    const Accountnumber = this.NpaReportForm.value.Accountnumber ;//String(this.Accountnumber.value);
  
    this.reportservice.fetchNpaSummarydetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: Branch,
      segment: Segment,
      subsegment: SubSegment,
      cutoffdate: cutoffDateInput,
      accountnumber: Accountnumber,
      options: Options
    }).subscribe({
      next: (response: any) => {
        if (response && response.message && response.message.length > 0) {
          const NpareportDetails = response.message; // Array of user objects
          let totalBranchCount=0,totalBranchGrossNPA = 0, totalBranchProvisions = 0,totalBranchNetNPA = 0, totalBranchAUM = 0;
          let totalSegmentCount=0,totalSegmentGrossNPA = 0, totalSegmentProvisions = 0,totalSegmentNetNPA = 0, totalSegmentAUM = 0;
          let totalSubSegmentCount=0,totalSubsegmentGrossNPA = 0, totalSubsegmentProvisions = 0,totalSubsegmentNetNPA = 0, totalSubsegmentAUM = 0;
    
          // Process the NpareportDetails and calculate totals
          this.summarybranchData = NpareportDetails.map((item: any) => {
            if (item.branch) {
              totalBranchCount += Number(item.branch_count || 0);
              totalBranchGrossNPA += Number(item.branch_GrossNPA || 0);
              totalBranchProvisions += Number(item.branch_Provisions || 0);
              totalBranchNetNPA += Number(item.branch_NetNPA || 0);
              totalBranchAUM += Number(item.branch_AUM || 0);
              return {
                Type: "Branch",
                summary_Branch: item.branch || "",
                branch_Count: item.branch_count || "",
                branch_GrossNPA: this.formatAmount(item.branch_GrossNPA) || "",
                branch_Provisions: this.formatAmount(item.branch_Provisions) || "",
                branch_NetNPA: this.formatAmount(item.branch_NetNPA) || "",
                branch_AUM:this.formatAmount( item.branch_AUM )|| "",
                branch_GNPA: item.branch_GNPA + "%" || "",
                branch_NNPA: item.branch_NNPA + "%" || ""
              };
            } else if (item.segment) {
              totalSegmentCount += Number(item.segment_count || 0);
              totalSegmentGrossNPA += Number(item.segment_GrossNPA || 0);
              totalSegmentProvisions += Number(item.segment_Provisions || 0);
              totalSegmentNetNPA += Number(item.segment_NetNPA || 0);
              totalSegmentAUM += Number(item.segment_AUM || 0);
              return {
                Type: "Segment",
                summary_Segment: item.segment || "",
                segment_Count: item.segment_count || "",
                segment_GrossNPA: this.formatAmount(item.segment_GrossNPA) || "",
                segment_Provisions: this.formatAmount(item.segment_Provisions) || "",
                segment_NetNPA: this.formatAmount(item.segment_NetNPA) || "",
                segment_AUM: this.formatAmount(item.segment_AUM) || "",
                segment_GNPA: item.segment_GNPA + "%" || "",
                segment_NNPA: item.segment_NNPA + "%" || ""
              };
            } else if (item.subsegment) {
              totalSubSegmentCount += Number(item.subsegment_count || 0);
              totalSubsegmentGrossNPA += Number(item.subsegment_GrossNPA || 0);
              totalSubsegmentProvisions += Number(item.subsegment_Provisions || 0);
              totalSubsegmentNetNPA += Number(item.subsegment_NetNPA || 0);
              totalSubsegmentAUM += Number(item.subsegment_AUM || 0);
              return {
                Type: "SubSegment",
                summary_Subsegment: item.subsegment || "",
                subsegment_Count: item.subsegment_count || "", 
                subsegment_GrossNPA: this.formatAmount(item.subsegment_GrossNPA) || "",
                subsegment_Provisions: this.formatAmount(item.subsegment_Provisions) || "",
                subsegment_NetNPA: this.formatAmount(item.subsegment_NetNPA) || "",
                subsegment_AUM: this.formatAmount(item.subsegment_AUM) || "",
                subsegment_GNPA: item.subsegment_GNPA + "%" || "",
                subsegment_NNPA: item.subsegment_NNPA + "%" || ""
              };
            }
            return null; // Exclude invalid entries
          });
  
          // Add totals for Branches, Segments, and Subsegments
          this.summarybranchData.push({
            Type: "Branch",
            summary_Branch: "Total",
            branch_Count: totalBranchCount,
            branch_GrossNPA: this.formatAmount(totalBranchGrossNPA),
            branch_Provisions: this.formatAmount(totalBranchProvisions),
            branch_NetNPA: this.formatAmount(totalBranchNetNPA),
            branch_AUM: this.formatAmount(totalBranchAUM),
          });
  
          this.summarybranchData.push({
            Type: "Segment",
            summary_Segment: "Total",
            segment_Count: totalSegmentCount,
            segment_GrossNPA: this.formatAmount(totalSegmentGrossNPA),
            segment_Provisions: this.formatAmount(totalSegmentProvisions),
            segment_NetNPA: this.formatAmount(totalSegmentNetNPA),
            segment_AUM: this.formatAmount(totalSegmentAUM),
          });
  
          this.summarybranchData.push({
            Type: "SubSegment",
            summary_Subsegment: "Total",
            subsegment_Count: totalSubSegmentCount,
            subsegment_GrossNPA: this.formatAmount(totalSubsegmentGrossNPA),
            subsegment_Provisions: this.formatAmount(totalSubsegmentProvisions),
            subsegment_NetNPA: this.formatAmount(totalSubsegmentNetNPA),
            subsegment_AUM: this.formatAmount(totalSubsegmentAUM),
          });
          this.branchData = this.summarybranchData.filter(item => item.Type === 'Branch');
          this.segmentData = this.summarybranchData.filter(item => item.Type === 'Segment');
          this.subsegmentData = this.summarybranchData.filter(item => item.Type === 'SubSegment');
  
          // Display the data
          this.showGrid = this.summarybranchData.length > 0;
        } else {
          if(this.NpaReportForm.value.CutoffDate){
          this.toastr.error('No Records.');
          }
        }
      },
      error: (err: any) => {
        this.toastr.error('Error fetching NPA report details.');
        console.error('Error fetching NPA report details:', err);
        this.showGrid = false;
      }
    });
  }
  updateDenomination(event: Event): void {
  const target = event.target as HTMLSelectElement; // Correct casting
  const denominationId = target.value; // Get the selected value
  this.selectedDenomination = denominationId;
  }

  formatAmount(amount: number | string | null | undefined): string {
  if (!amount || isNaN(Number(amount))) return "0.00"; // Handle null, undefined, or invalid values

  switch (this.selectedDenomination) {
    case "1": // Actual
      return Number(amount).toFixed(2);
    case "2": // Lakhs
      return (Number(amount) / 100000).toFixed(2) ;
    case "3": // Crores
      return (Number(amount) / 10000000).toFixed(2) ;
    default: // Default to Lakhs
      return (Number(amount) / 100000).toFixed(2) ;
  }
  }
  Savescheduler(): void {
    if (!this.NpaReportForm.get('CutoffDate')?.value) {
      this.toastr.error('Cutoff Date is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }
  
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; // Replace with dynamic companyId if required
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const Branch = String(this.NpaReportForm.value.Branch || '').trim();
    const Segment = String(this.NpaReportForm.value.Segment || '').trim();
    const SubSegment = String(this.NpaReportForm.value.SubSegment || '').trim();
    const cutoffDateInput = this.NpaReportForm.value.CutoffDate;
    const Options = 5;
    const Accountnumber = this.NpaReportForm.value.Accountnumber ;//String(this.Accountnumber.value);
  
    this.reportservice.fetchNpaSummarydetails({
      userId: userIdAsNumber,
      companyId: companyId,
      branch: Branch,
      segment: Segment,
      subsegment: SubSegment,
      cutoffdate: cutoffDateInput,
      accountnumber: Accountnumber,
      options: Options
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

}


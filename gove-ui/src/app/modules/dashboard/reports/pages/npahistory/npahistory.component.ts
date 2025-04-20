import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { IFOSLookup,IGoveBranchLookup,IExistinghNpahistoryRequestData } from '../../../../../../core/interfaces/app/request/IFOSModels';

@Component({
  selector: 'app-npahistory',
  templateUrl: './npahistory.component.html',
  styleUrl: './npahistory.component.scss'
})
export class NpahistoryComponent {
  public NpaHistoryForm: FormGroup;
  showGrid: boolean = false;
  public loggedInUser: any = {};
  branchData: any[] = [];
  public existingNpaDetails: IExistinghNpahistoryRequestData[] = []; // Adjusted type to array
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportservice: ReportsService
  ) {
    // Initialize the form group with FormBuilder
    this.NpaHistoryForm = this.fb.group({
      Accountnumber: [''],
      FromDate : [''],
      ToDate:['']
    });
  }
  ngOnInit(): void {
   
  }
  exportToExcel(): void {
    const fromDate = this.NpaHistoryForm.get('FromDate')?.value;
    const toDate = this.NpaHistoryForm.get('ToDate')?.value;

    if (!fromDate && toDate) {
      this.toastr.error('From Date is required when To Date is entered.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }

    if (fromDate && !toDate) {
      this.toastr.error('To Date is required when From Date is entered.', 'Validation Error', {
        timeOut: 3000,
      });
      return;
    }

    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      if (fromDateObj > toDateObj) {
        this.toastr.error('From Date cannot be greater than To Date.', 'Validation Error', {
          timeOut: 3000,
        });
        return;
      }
    }

    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; 
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const FromDateInput = this.NpaHistoryForm.value.FromDate ;
    const Accountnumber =  this.NpaHistoryForm.value.Accountnumber;//  String(this.Accountnumber.value);
    const ToDateInput = this.NpaHistoryForm.value.ToDate ;
    const Options = 2;
   
    this.reportservice
      .fetchNpaHistorydetails({
        userId: userIdAsNumber,
        companyId: companyId,
        fromdate:FromDateInput,
        accountnumber:Accountnumber,
        todate: ToDateInput,
        options: Options
      })
      .subscribe({
        next: (response: any) => {
          if (response && response.message && response.message.length > 0) {
            const NpareportDetails = response.message; // Array of user objects
            this.existingNpaDetails = NpareportDetails as IExistinghNpahistoryRequestData[];
  
            // Construct HTML string for Excel
            let shtml = `
              <html>
                <head>
                  <title>NPA History</title>
                </head>
                <body>
                  <table style="FONT-SIZE: 18px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
                    <tbody>
                      <tr>
                        <th colspan="9" style="text-align:left;">Gove Finance Limited</th>
                      </tr>
                      <tr>
                        <th colspan="9" style="text-align:left;">NPA History Report</th>
                      </tr>
                      <tr><td colspan="9"></td></tr>
                      <tr>
                        <th>Contract No</th>
                        <th>NPA Process Date</th>
                        <th>NPA Entry Date</th>
                        <th>NPA Exit Date</th>
                        <th>NPA Category</th>
                        <th>DMinDt</th>
                        <th>Due Amount</th>
                        <th>DPD Days</th>                       
                      </tr>
            `;
 
            // Add data rows
            NpareportDetails.forEach((user: IExistinghNpahistoryRequestData) => {
              shtml += `
                <tr>
                  <td>${user.panum || ''}</td>
                  <td>${user.npA_Process_Date || ''}</td>
                  <td>${user.npA_Entry_Date || ''}</td>
                  <td>${user.npA_Exit_Date || ''}</td>
                  <td>${user.npaCategory || ''}</td>
                  <td>${user.dMinDt || ''}</td>
                  <td>${user.dueAmount || ''}</td>
                  <td>${user.dpD_Days || ''}</td>
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
          link.download = 'NPA_History.xls'; // Note: Use .xls extension for browser compatibility
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
    this.NpaHistoryForm.reset({
      Accountnumber: '',
      FromDate: '',
      ToDate: ''
    });
  }
  Go(): void {
    if (!this.NpaHistoryForm.get('Accountnumber')?.value) {
      this.toastr.error('Account Number is required.', 'Validation Error', {
        timeOut: 3000,
      });
      return; 
    }
  
    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1; 
    const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10);
    const FromDateInput = this.NpaHistoryForm.value.FromDate;
    const Accountnumber = this.NpaHistoryForm.value.Accountnumber;
    const ToDateInput = this.NpaHistoryForm.value.ToDate;
    const Options = 1;
  
    this.reportservice
      .fetchNpaHistorydetails({
        userId: userIdAsNumber,
        companyId: companyId,
        fromdate: FromDateInput,
        accountnumber: Accountnumber,
        todate: ToDateInput,
        options: Options
      })
      .subscribe({
        next: (response: any) => {
          if (response && response.message && response.message.length > 0) {
            this.branchData = response.message.map((item: any) => ({
              panum: item.panum,
              npA_Process_Date: item.npA_Process_Date,
              npA_Entry_Date: item.npA_Entry_Date,
              npA_Exit_Date: item.npA_Exit_Date,
              npaCategory: item.npaCategory,
              dMinDt: item.dMinDt,
              dueAmount: item.dueAmount,
              dpD_Days: item.dpD_Days
            }));
  
            this.showGrid = true;
          } else {
            this.toastr.error('No Records');
            this.showGrid = false;
          }
        },
        error: (err: any) => {
          this.toastr.error('Error fetching user details.');
          console.error('Error fetching user details:', err);
          this.showGrid = false;
        },
      });
  }
  
}

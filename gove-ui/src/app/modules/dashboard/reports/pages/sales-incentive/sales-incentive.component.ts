import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { IFOSLookup,IGoveBranchLookup,IExistinghSalesreportsRequestData } from '../../../../../../core/interfaces/app/request/IFOSModels';


@Component({
  selector: 'app-sales-incentive',
  templateUrl: './sales-incentive.component.html',
  styleUrl: './sales-incentive.component.scss'
})
export class SalesIncentiveComponent {
  public SalesIncentiveForm: FormGroup;
  public loggedInUser: any = {};
  isSaveEnabled: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportservice: ReportsService
  ) {
    this.SalesIncentiveForm = this.fb.group({
      Cutoffmonth:['']
    });
  }
  ngOnInit(): void {
  }
  clearExcel() {   
    this.SalesIncentiveForm.reset({
      Cutoffmonth: ''
    });
  }
  Salesincentiveexcel(): void {
      if (!this.SalesIncentiveForm.get('Cutoffmonth')?.value) {
        this.toastr.error('Cutoff Month is required.', 'Validation Error', {
          timeOut: 3000,
        });
        return;
      }
      this.loaderService.showLoader();
      const cutoffDateInput = this.SalesIncentiveForm.value.Cutoffmonth;
      const formattedDate = cutoffDateInput.substring(0, 4) + cutoffDateInput.substring(5, 7);
      const year = cutoffDateInput.substring(0, 4);  // "2025"
      const month = parseInt(cutoffDateInput.substring(5, 7)) - 1; 
      const monthName = new Date(parseInt(year), month).toLocaleString('en-US', { month: 'long' });
      const formattedDate1 = `${monthName} ${year}`;
      this.reportservice
        .fetchSalesIncentivedetails({
          cutoffdate: formattedDate,
          userId: 1,
          options:1
        })
        .subscribe({
          next: (response: any) => {
            if (response && response.message && response.message.length > 0) {
              const NpareportDetails = response.message; 
              const firstRecord = NpareportDetails.find((item: IExistinghSalesreportsRequestData) => item.User);           
              const User = firstRecord?.User || '';
              const errorcode = firstRecord?.errorcode ;
              
   
              let shtml = `
                <html>
                  <head>
                    <title>Sales Incentive BM</title>
                  </head>
                  <body>
                    <table style="FONT-SIZE: 18px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
                      <tbody>
                        <tr>
                          <th colspan="9" style="text-align:centre; padding-left: 250px;">Gove Finance Limited</th>
                        </tr>
                        <tr>
                          <th colspan="9" style="text-align:centre;">${formattedDate1} - Sales Incentive Report </th>
                        </tr>
                        <tr><td colspan="9"></td></tr>
                        <tr>
                          <th colspan="4" style="text-align:left;">Report Date : ${new Date(cutoffDateInput).toLocaleDateString()} </th>
                        </tr>
                        <tr>
                          <th colspan="4" style="text-align:left;">Spooled By : ${User}</th>
                        </tr>
                        <tr><td colspan="9"></td></tr>
                        <tr>
                          <th colspan="9" style="text-align:left;">Manager Incentive</th>
                        </tr>
                        <tr><td colspan="9"></td></tr>
                        <tr>
                          <th>Incentive Month</th>
                          <th>Branch</th>
                          <th>Staff Code</th>
                          <th>Staff Name</th>
                          <th>Target Amount</th>
                          <th>Business Amount</th>
                          <th>Incentive CAP Amount</th>
                          <th>Business Archeived Percentage</th>
                          <th>Business Incentive Amount</th>
                          <th>IRR Archeived Percentage</th>
                          <th>IRR Incentive Amount</th>
                          <th>FOS Archeived Percentage</th>
                          <th>FOS Incentive Amount</th>
                          <th>Total Incnetive Amount</th>
                        </tr>
              `;
              NpareportDetails.forEach((item: IExistinghSalesreportsRequestData) => {
                if (item.IncentiveMonth) { // Check if it's a summary row
                  shtml += `
                    <tr>
                      <td>${item.IncentiveMonth || ''}</td>
                      <td>${item.Branch || ''}</td>
                      <td>${item.StaffCode || ''}</td>
                      <td>${item.StaffName || ''}</td>
                      <td>${item.TargetAmount || ''}</td>
                      <td>${item.BusinessAmount || ''}</td>
                      <td>${item.IncentiveCAPAmount || ''}</td>
                      <td>${item.BusinessArcheivedPercentage || ''}</td>
                      <td>${item.BusinessIncentiveAmount || ''}</td>
                       <td>${item.IRRArcheivedPercentage || ''}</td>
                      <td>${item.IRRIncentiveAmount || ''}</td>
                      <td>${item.FOSArcheivedPercentage || ''}</td>
                      <td>${item.FOSIncentiveAmount || ''}</td>
                      <td>${item.TotalIncnetiveAmount || ''}</td>
                    </tr>
                  `;
                }
              });
    
              shtml += `
                        <tr><td colspan="9"></td></tr>
                        <tr>
                          <th colspan="9" style="text-align:left;">Staff Incentives</th>
                        </tr>
                        <tr><td colspan="9"></td></tr>
                        <tr>
                          <th>Branch</th>
                          <th>Staff Code</th>
                          <th>Staff Name</th>
                          <th>Designation</th>
                          <th>Contract Count</th>
                          <th>Business Amount</th>
                          <th>Incentive Amount</th>
                        </tr>
              `;
              NpareportDetails.forEach((item: IExistinghSalesreportsRequestData) => { //IExistinghSalesreportsRequestData
                if (item.Designation) { // Check if it's an installment row
                  shtml += `
                    <tr>
                      <td>${item.Branch || ''}</td>
                      <td>${item.StaffCode || ''}</td>
                      <td>${item.StaffName || ''}</td>
                      <td>${item.Designation || ''}</td>
                      <td>${item.ContractCount || ''}</td>
                      <td>${item.BusinessAmount || ''}</td>
                      <td>${item.IncentiveAmount || ''}</td>
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
              link.download = 'Sale Incentive Reports.xls'; // Using .xls extension for browser compatibility
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              if(errorcode == 1)
              {
                  this.isSaveEnabled = false;
              }else {
                this.isSaveEnabled = true;
              }
            } else {
              this.toastr.error('No Records');
              this.isSaveEnabled = false;
            }
          },
          error: (err: any) => {
            this.toastr.error('Error fetching SOA details.');
            console.error('Error fetching SOA details:', err);
          },
        });
    }

    Salesincentivesave(): void {
      if (!this.SalesIncentiveForm.get('Cutoffmonth')?.value) {
        this.toastr.error('Cutoff Month is required.', 'Validation Error', {
          timeOut: 3000,
        });
        return;
      }
      this.loaderService.showLoader();
      const cutoffDateInput = this.SalesIncentiveForm.value.Cutoffmonth;
      const formattedDate = cutoffDateInput.substring(0, 4) + cutoffDateInput.substring(5, 7);
      const year = cutoffDateInput.substring(0, 4);  // "2025"
      const month = parseInt(cutoffDateInput.substring(5, 7)) - 1; 
      const monthName = new Date(parseInt(year), month).toLocaleString('en-US', { month: 'long' });
      const formattedDate1 = `${monthName} ${year}`;
      this.reportservice
        .fetchSalesIncentivedetails({
          cutoffdate: formattedDate,
          userId: 1,
          options:2
        })
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.toastr.success('Sales Incentive successfully.', 'Success');
            } else {
              this.toastr.warning('No data found for the given Cutoff Date.', 'Warning');
            }
          },
          error: (err: any) => {
            this.toastr.error('Error fetching SOA details.');
            console.error('Error fetching SOA details:', err);
          },
        });
    } 
}

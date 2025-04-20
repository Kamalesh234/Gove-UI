import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ReportsService} from '../../../../../../data/services/feature/Reports/Reports-service'
import { LoaderService } from '../../../../../../data/services/shared/loader.service';
import { IFOSLookup,IGoveBranchLookup,IExistinghCollectionreportsRequestData } from '../../../../../../core/interfaces/app/request/IFOSModels';


@Component({
  selector: 'app-collectionincentivereport',
  templateUrl: './collectionincentivereport.component.html',
  styleUrl: './collectionincentivereport.component.scss'
})
export class CollectionincentivereportComponent {
  public CollectionIncentiveForm: FormGroup;
  public loggedInUser: any = {};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportservice: ReportsService
  ) {
    this.CollectionIncentiveForm = this.fb.group({
      Cutoffmonth:['']
    });
  }
  ngOnInit(): void {
   
  }
  clearExcel() {   
    this.CollectionIncentiveForm.reset({
      Cutoffmonth: ''
    });
  }
  collectionincentiveexcel(): void {
      if (!this.CollectionIncentiveForm.get('Cutoffmonth')?.value) {
        this.toastr.error('Cutoff Month is required.', 'Validation Error', {
          timeOut: 3000,
        });
        return;
      }
      this.loaderService.showLoader();
      const cutoffDateInput = this.CollectionIncentiveForm.value.Cutoffmonth;
     
      this.reportservice
        .fetchCollectionIncentivedetails({
          cutoffdate: cutoffDateInput,
          userId: 1,
          options: 0
        })
        .subscribe({
          next: (response: any) => {
            if (response && response.message && response.message.length > 0) {
              const NpareportDetails = response.message; 
              const firstRecord = NpareportDetails.find((item: IExistinghCollectionreportsRequestData) => item.User);           
              const User = firstRecord?.User || '';
   
              let shtml = `
                <html>
                  <head>
                    <title>Collection Incentive BM</title>
                  </head>
                  <body>
                    <table style="FONT-SIZE: 18px; FONT-FAMILY: calibri; WIDTH: 100%; BORDER-COLLAPSE: collapse; FONT-WEIGHT: normal; COLOR: #000000;" cellspacing="0" cellpadding="1" rules="all" border="1">
                      <tbody>
                        <tr>
                          <th colspan="9" style="text-align:centre; padding-left: 250px;">Gove Finance Limited</th>
                        </tr>
                        <tr>
                          <th colspan="9" style="text-align:centre;">Collection Incentive Report </th>
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
                          <th>Date </th>
                          <th>Branch</th>
                          <th>User Code</th>
                          <th>Manager Name</th>
                          <th>Contract Count</th>
                          <th>Opening Demand</th>
                          <th>Collection Amount</th>
                          <th>Efficiency Percentage</th>
                          <th>Incentive Amount 1</th>
                          <th>0 to 2 Bucket Opening Count</th>
                          <th>0 to 2 Bucket Closing Count</th>
                          <th>0 to 2 Efficiency Percentage</th>
                          <th>Incentive Amount 2</th>
                          <th>0 Bucket Demand</th>
                          <th>0 Bucket Collection</th>
                          <th>0 Efficiency Percentage</th>
                          <th>Incentive Amount 3</th>
                          <th>2 Bucket Demand</th>
                          <th>2 Bucket Collection</th>
                          <th>2 Efficiency Percentage</th>
                          <th>Incentive Amount 4</th>
                          <th>Gross NPA Amount</th>
                          <th>Total AUM Amount</th>
                          <th>GNPA Percentage</th>
                          <th>Incentive Amount 5</th>
                          <th>Total Incentive Amount</th>
                        </tr>
              `;
              NpareportDetails.forEach((item: IExistinghCollectionreportsRequestData) => {
                if (item.Date) { // Check if it's a summary row
                  shtml += `
                    <tr>
                      <td>${item.Date || ''}</td>
                      <td>${item.Branch || ''}</td>
                      <td>${item.UserCode || ''}</td>
                      <td>${item.ManagerName || ''}</td>
                      <td>${item.ContractCount || ''}</td>
                      <td>${item.OpeningDemand || ''}</td>
                      <td>${item.CollectionAmount || ''}</td>
                      <td>${item.EfficiencyPercentage || ''}</td>
                      <td>${item.IncentiveAmount1 || ''}</td>
                       <td>${item.Zeroto2BucketOpeningCount || ''}</td>
                      <td>${item.Zeroto2BucketClosingCount || ''}</td>
                      <td>${item.Zeroto2_EfficiencyPercentage || ''}</td>
                      <td>${item.IncentiveAmount2 || ''}</td>
                      <td>${item.Zero_BucketDemand || ''}</td>
                      <td>${item.Zero_BucketCollection || ''}</td>
                      <td>${item.Zero_Efficiency_Percentage || ''}</td>
                      <td>${item.IncentiveAmount_3 || ''}</td>
                      <td>${item.Two_BucketDemand || ''}</td>
                      <td>${item.Two_BucketCollection || ''}</td>
                      <td>${item.Two_EfficiencyPercentage || ''}</td>
                      <td>${item.IncentiveAmount_4 || ''}</td>
                      <td>${item.GrossNPAAmount || ''}</td>
                      <td>${item.TotalAUMAmount || ''}</td>
                       <td>${item.GNPAPercentage || ''}</td>
                      <td>${item.IncentiveAmount_5 || ''}</td>
                      <td>${item.TotalIncentiveAmount || ''}</td>
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
                          <th>User Code</th>
                          <th>Staff Name</th>
                          <th>Contract Count</th>
                          <th>Opening Demand</th>
                          <th>Collection Amount</th>
                          <th>Efficiency Percentage</th>
                          <th>Incentive Amount 1</th>
                          <th>0 to 2 Bucket Opening Count</th>
                          <th>0 to 2 Bucket Closing Count</th>
                          <th>0 to 2 Efficiency Percentage</th>
                          <th>Incentive Amount 2</th>
                          <th>0 Bucket Demand</th>
                          <th>0 Bucket Collection</th>
                          <th>0 Efficiency Percentage</th>
                          <th>Incentive Amount 3</th>
                          <th>2 Bucket Demand</th>
                          <th>2 Bucket Collection</th>
                          <th>2 Efficiency Percentage</th>
                          <th>Incentive Amount 4</th>
                          <th>Gross NPA Amount</th>
                          <th>Total AUM Amount</th>
                          <th>GNPA Percentage</th>
                          <th>Incentive Amount 5</th>
                          <th>Total Incentive Amount</th>
                        </tr>
              `;
              NpareportDetails.forEach((item: IExistinghCollectionreportsRequestData) => { //IExistinghSalesreportsRequestData
                if (item.Dates) { // Check if it's an installment row
                  shtml += `
                    <tr>
                      <td>${item.Branch || ''}</td>
                      <td>${item.UserCode || ''}</td>
                      <td>${item.StaffName || ''}</td>
                      <td>${item.ContractCount || ''}</td>
                      <td>${item.OpeningDemand || ''}</td>
                      <td>${item.CollectionAmount || ''}</td>
                      <td>${item.EfficiencyPercentage || ''}</td>
                      <td>${item.IncentiveAmount1 || ''}</td>
                       <td>${item.Zeroto2BucketOpeningCount || ''}</td>
                      <td>${item.Zeroto2BucketClosingCount || ''}</td>
                      <td>${item.Zeroto2_EfficiencyPercentage || ''}</td>
                      <td>${item.IncentiveAmount2 || ''}</td>
                      <td>${item.Zero_BucketDemand || ''}</td>
                      <td>${item.Zero_BucketCollection || ''}</td>
                      <td>${item.Zero_Efficiency_Percentage || ''}</td>
                      <td>${item.IncentiveAmount_3 || ''}</td>
                      <td>${item.Two_BucketDemand || ''}</td>
                      <td>${item.Two_BucketCollection || ''}</td>
                      <td>${item.Two_EfficiencyPercentage || ''}</td>
                      <td>${item.IncentiveAmount_4 || ''}</td>
                      <td>${item.GrossNPAAmount || ''}</td>
                      <td>${item.TotalAUMAmount || ''}</td>
                       <td>${item.GNPAPercentage || ''}</td>
                      <td>${item.IncentiveAmount_5 || ''}</td>
                      <td>${item.TotalIncentiveAmount || ''}</td>
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
              link.download = 'Collection Incentive Reports.xls'; // Using .xls extension for browser compatibility
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
}

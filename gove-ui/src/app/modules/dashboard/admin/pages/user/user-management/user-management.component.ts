import { FormControl, FormGroup, Validators ,FormBuilder,} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import{UserManagementService} from'../../../../../../../data/services/feature/userManagement/user-management.service';
 import { UtilsService } from '../../../../../../../data/services/shared/utils.service';
 import { LoaderService } from '../../../../../../../data/services/shared/loader.service';
 import {
  IExistinghUserRequest,
  IExistinghUserRequestData,
  IExistinghUserRequestTranslander,
  IExistinghUserRequestTranslanderData,
  IFOSLookup,
 
  
} from '../../../../../../../core/interfaces/app/request/IFOSModels';
import { AfterViewInit, Component, ViewChild ,OnInit} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

// import { saveAs } from 'file-saver';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent  implements  OnInit {

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  public showTable: boolean = false
  public displayedColumns: string[] = ['userCode', 'userName', 'email', 'designation','userLevel', 'view', 'modify']
  public dataSource = new MatTableDataSource<any>()
  filters: { [key: string]: string } = {};
  public existingUserDetails: IExistinghUserRequestData = {};

  users: IExistinghUserRequestTranslanderData[] = []; // Array to store user data
  public loggedInUser: any = {};

 


  ngAfterViewInit():void { 
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      console.error('DataSource is not initialized!');
    }
  }

 




  constructor( private fb: FormBuilder,
     private router: Router,
    private utilityService: UtilsService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private useManagementService:UserManagementService,
    // private encryptionService: EncryptionService
  ) { }


  
// Apply filter for a specific column
applyFilter(event: Event, column: string) {
  const filterValue = (event.target as HTMLInputElement).value
    .trim()
    .toLowerCase();

  // Update the filter for the specific column
  this.filters[column] = filterValue;

  // Combine filters and set the filtered data
  this.dataSource.filterPredicate = (data: any, filter) => {
    const filters = JSON.parse(filter);
    return Object.keys(filters).every((key) =>
      data[key].toString().toLowerCase().includes(filters[key])
    );
  };

  this.dataSource.filter = JSON.stringify(this.filters);
}

  ngOnInit(): void {
    this.getExistingUserDetailsTranlander();
  }

  getExistingUserDetailsTranlander() {
    const companyId = this.loggedInUser?.companyId || 1;
     this.loaderService.showLoader();
    this.useManagementService.fetchExistingUserDetailsTranlander({
      companyId:companyId,
      userId: this.loggedInUser.userId
    } as IExistinghUserRequestTranslander).subscribe({
      next: (data: any) => {
        this.loaderService.hideLoader();
        if (data && data.message) {
          
          this.users = data.message as IExistinghUserRequestTranslanderData[];
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
           console.log(this.users)

        
           this.showTable = true
        // Optional: You can call a method to trigger additional UI changes if needed
        // this.displayTable();
        }
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toasterService.error(error.message, 'Error', { timeOut: 3000 });
      },
    });
}

 // Function to export data to Excel
 exportDataToExcel(): void {
  const companyId = this.loggedInUser?.companyId || 1;

  this.loaderService.showLoader();
  this.useManagementService
    .fetchExistingUserDetailsTranlander({
      companyId: companyId,
      userId: this.loggedInUser.userId,
    })
    .subscribe({
      next: (data: any) => {
        this.loaderService.hideLoader();
        if (data && data.message) {
          const users = data.message as any[];

          // Convert JSON data to a worksheet
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(users);

          // Create a workbook and add the worksheet
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

          // Write the workbook and trigger download
          XLSX.writeFile(workbook, 'UsersData.xlsx');
        }
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toasterService.error(error.message, 'Error', { timeOut: 3000 });
      },
    });
}


viewOrModifyUser(userId: string, action: string): void {

  // Navigate to the 'user-create' path with userId and action as query parameters
  this.router.navigate(['/system-admin/user-create'], { queryParams: { userId, action } });
}




exportToExcel(): void {
  const companyId = 1; // Replace with dynamic companyId if required
  const loggedInUsername = localStorage.getItem('username') || 'Guest'; // Fetch username from localStorage
  const userIdAsNumber = parseInt(localStorage.getItem('User_ID') || '0', 10); // Default to 0 if undefined

  // API call to fetch user details
  this.useManagementService
    .fetchExistingUserDetails({
      userId: userIdAsNumber,
      companyId: companyId,
    })
    .subscribe({
      next: (response: any) => {
        if (response && response.message && response.message.length > 0) {
          const userDetails = response.message; // Array of user objects
          this.existingUserDetails = userDetails as IExistinghUserRequestData;

          // Prepare data for the Excel file
          const excelData = [
            ['Mahaveer Finance Limited'], // Heading 1
            ['User Management'], // Heading 2
            [`Username: ${loggedInUsername}`], // Logged-in username
            [], // Empty row for spacing
            ['User Code', 'Name', 'Mobile Number', 'Joining Date', 'Designation', 'User Level ID', 'User Group', 'Email ID'], // Column headers
          ];

          // Iterate over user details and add rows to excelData
          userDetails.forEach((user: IExistinghUserRequestData) => {  
            excelData.push([
              user.userCode || 'N/A',
              user.userName || 'N/A',
              user.mobileNumber || 'N/A',
              user.doj ? this.transformDate(user.doj) : 'N/A', // Format the date
              String(user.designation) || 'N/A',              // Convert to string
              String(user.userLevel) || 'N/A',              // Convert to string
              String(user.userGroup) || 'N/A',          
              user.emailID || 'N/A',
            ]);
          });

          // Create a worksheet
          const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);


// Apply bold styling to the first row (Heading 1)
const headingCell = worksheet['A1']; // 'A1' refers to the first cell in the first row
if (headingCell) {
  headingCell.s = {
    font: {
      bold: true, // Make the text bold
      sz: 14,     // Optional: Set font size (e.g., 14)
    },
    alignment: {
      horizontal: 'center', // Optional: Center-align text
    },
  };
}


          // Create a workbook and append the worksheet
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'UserDetails');

          // Write the workbook to a buffer
          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });

          // Trigger file download
          this.downloadExcel(excelBuffer, 'UserDetails.xlsx');
        } else {
          console.error('No data received from the API');
        }
      },
      error: (err: any) => {
        console.error('Error fetching user details:', err);
      },
    });
}


// Utility function to format date as "YYYY-MM-DD"
transformDate(date: string | Date): string {
  const parsedDate = date instanceof Date ? date : new Date(date);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
  return parsedDate.toLocaleDateString('en-GB', options); // Format as DD/MM/YYYY
}


// Utility function to download Excel file
private downloadExcel(buffer: any, fileName: string): void {
  const blob: Blob = new Blob([buffer], { type: 'application/octet-stream' });

  // Native JavaScript download implementation
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}



}



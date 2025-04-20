import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  IExistinghUserRequest,
  IExistinghUserRequestData,
  IInsertUserDetails,
  IFOSUserReportingLookup,
  IFOSLookup,
} from '../../../../../../../core/interfaces/app/request/IFOSModels';
import { FOSProspectService } from '../../../../../../../data/services/feature/prospectMaster/prospects.service';
import { UserManagementService } from '../../../../../../../data/services/feature/userManagement/user-management.service';
import { UtilsService } from '../../../../../../../data/services/shared/utils.service';
import { FOSLeadMasterService } from '../../../../../../../data/services/feature/leadMaster/leadmaster.service';
import { LoaderService } from '../../../../../../../data/services/shared/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { every } from 'rxjs';
import { Extension } from 'typescript';
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent implements OnInit {

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  userId: string | null = null;
  action: string | null = null;
  selectedImage: string | ArrayBuffer | null = null;
  isEditMode = false; // Flag to toggle edit mode
  maxDate!: string; // Maximum date allowed for 18+
  public userManagementForm: FormGroup | any = new FormGroup({});
  public userPersonalDetails: FormGroup | any = new FormGroup({});
  breadcrumbText: string = 'User Create'; // Default value
  public isSubmitted: boolean = false;
  public genderLookup: IFOSLookup[] = [];
  public setUserDesignationLevel: IFOSLookup[] = [];
  public maritalStatusLookup: IFOSLookup[] = [];
  public userImageFilepath: string = '';
  public userImageFileContent: string = '';
  private allowedExtention: string[]=['png','jpg','jpeg']
  public setUserLevel: IFOSLookup[] = [];
  public setUserReportingLevel: IFOSUserReportingLookup[] = [];
  public existingUserDetails: IExistinghUserRequestData = {};
  public loggedInUser: any = {};

  constructor(
    private fb: FormBuilder,
    private prospectService: FOSProspectService,
    private utilityService: UtilsService,
    private leadsService: FOSLeadMasterService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private useManagementService: UserManagementService,
    private location: Location,
    private route: ActivatedRoute // private encryptionService: EncryptionService
  ) {}


  ngOnInit(): void {
    this.setuserManagement();
    this.fetAllLookups();
    this.calculateMaxDate();
  
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'] || null;
      this.action = params['action'] || null;
      this.isEditMode = this.action === 'modify';
  
      // Update the breadcrumb text based on the action
      if (this.action === 'view') {
        this.breadcrumbText = 'User View';
        this.userManagementForm.disable();
        this.userPersonalDetails.disable();
      } else if (this.action === 'modify') {
        this.breadcrumbText = 'User Modify';
        this.userManagementForm.enable();
        this.userPersonalDetails.enable();
      } else {
        this.breadcrumbText = 'User Create';
        this.userManagementForm.enable();
        this.userPersonalDetails.enable();
      }
  
      if (this.userId) {
        this.fetchExistingUserDetails(this.userId);
      }
    });
  }
 

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input?.files?.length) {
      const file = input.files[0];
  
      // Check the file size (1MB = 1 * 1024 * 1024 bytes)
      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
  
      if (file.size > maxSizeInBytes) {
        // Reset form fields when file is too large
        this.userImageFilepath = '';
        this.userImageFileContent = '';
        this.selectedImage = null; // Clear the selected image
        
        // Show error message
        this.toasterService.show('File size must be less than 1MB', 'File Upload', { timeOut: 3000 });
        
        // Clear file input to prevent selection of oversized file
        input.value = ''; 
        return; // Stop further execution
      }
  
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // Validate file extension
      if (extension && !this.allowedExtention.includes(extension)) {
        this.userImageFilepath = '';
        this.userImageFileContent = '';
        this.selectedImage = null; // Clear the selected image
        this.toasterService.show('Invalid file type. Please upload a PNG or JPG file.', 'File Upload', { timeOut: 3000 });
        input.value = ''; // Clear file input on invalid type
        return;
      }
  
      // If file size and type are valid, read the file and display image
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.selectedImage = reader.result.toString(); // Set the image data URL
          this.userImageFileContent = reader.result.toString().split(',')[1];
        }
      };
      this.userImageFilepath = file.name;
      reader.readAsDataURL(file);
    }
  }
  
  

 

  setuserManagement = () => {
    this.userManagementForm = new FormGroup({
      userIdCode: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      emergencyContactNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      emergencyContactPerson: new FormControl(''),
      joiningDate: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      userLevel: new FormControl('', [Validators.required]),
      reportingNextLevel: new FormControl('', [Validators.required]),
      userGroup: new FormControl(''),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required]),
      relivingDate: new FormControl(''),
      age: new FormControl({ value: '', disabled: true }),
      isActive: new FormControl(false), // Default value
      // dateOfBirth:new FormControl('',[Validators.required]),
      // age:new FormControl(''),
    });

    this.userPersonalDetails = new FormGroup({
      fatherName: new FormControl('', [Validators.required]),
      motherName: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      spouseName: new FormControl('', [Validators.required]),
      userPhoto: new FormControl('', [Validators.required]),
      aadharNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{12}$/), // Exactly 12 numeric digits
      ]),
      panNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/), // PAN format: 5 uppercase letters, 4 digits, 1 uppercase letter
      ]),
    });
  };

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }
  limitMobileNumberLength(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10); // Trim to 10 characters
    }
  }
  
  allowOnlyAlphabets(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
  
    // Allow A-Z and a-z only
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      return; // Allow input
    }
  
    // Prevent any other character
    event.preventDefault();
  }
  

  getProspectLookup() {
    this.loaderService.showLoader();
    this.prospectService.fetchProspectLookup().subscribe({
      next: (data: any) => {
        this.loaderService.hideLoader();
        if (data && data.message) {
          let lookItems = data.message as IFOSLookup[];
          localStorage.setItem('lookups', JSON.stringify(lookItems));
          this.SetLookups(lookItems);
        }
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toasterService.error(error.message, 'Error', { timeOut: 3000 });
      },
    });
  }

  // fetchLeadLookup() {
  //   const companyId = this.loggedInUser?.companyId || 1; // Default to 1 if companyId is missing
  //   const userId = this.loggedInUser?.userId || 1;
  //   this.loaderService.showLoader();
    
  //   this.leadsService.fetchLeadGenerationLookup(companyId, userId).subscribe({
  //     next: (data: any) => {
  //       this.loaderService.hideLoader();
  //       let lookupData = data.message as IFOSLookup[];
  //       this.maritalStatusLookup = lookupData.filter(
  //         (s) => s.lookupTypeId == 32
  //       );
  //       // localStorage.setItem('lookups', JSON.stringify(lookupData));
  //       // this.SetLookups(lookupData);
  //       // localStorage.setItem(
  //       //   'leadGenerationLookups',
  //       //   JSON.stringify(lookupData)
  //       // );
  //     },
  //     error: (error: any) => {
  //       this.loaderService.hideLoader();
  //       let errorMessages = error.message.split('|');
  //       for (const key in errorMessages) {
  //         this.toasterService.error(errorMessages[key], 'Error', {
  //           timeOut: 2000,
  //         });
  //       }
  //     },
  //   });
  // }

 
  calculateMaxDate(): void {
    const today = new Date();
    const maxSelectableDate = new Date(
      today.getFullYear() - 18, // Subtract 18 years from the current year
      today.getMonth(),
      today.getDate()
    );
    this.maxDate = maxSelectableDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  calculateAge(): void {
    const dateOfBirth = this.userManagementForm.get('dateOfBirth')?.value;
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      // Set the age in the form
      this.userManagementForm.get('age')?.setValue(age);

      // Validate if age is less than 18 and show error
      if (age < 18) {
        this.toasterService.error('Age must be 18 or older', 'Invalid Age', {
          timeOut: 3000
        });
      }
    }
  }
  
  
  

 

  private SetLookups(lookItems: IFOSLookup[]) {
    this.genderLookup = lookItems.filter(
      (s: IFOSLookup) => s.lookupTypeId == 2
    );
    this.maritalStatusLookup=lookItems.filter(
      (s: IFOSLookup) => s.lookupTypeId == 32
    );
  }

  getUserLevel() {
    const companyId = this.loggedInUser?.companyId || 1; // Default to 1 if companyId is missing
    const userId = this.loggedInUser?.userId || 1;
    this.loaderService.showLoader();
    this.useManagementService
      .fetchUserLevelLookup({
        companyId: companyId,
        userId: userId,
      })
      .subscribe({
        next: (data: any) => {
          this.loaderService.hideLoader();
          if (data && data.message) {
            let lookItems = data.message as IFOSLookup[];
            this.setUserLevel = lookItems;
          }
        },
        error: (error: any) => {
          this.loaderService.hideLoader();
          this.toasterService.error(error.message, 'Error', { timeOut: 3000 });
        },
      });
  }


  

  getUserReportingLevel() {
    const companyId = this.loggedInUser?.companyId || 1; // Default to 1 if companyId is missing
    const userId = this.loggedInUser?.userId || 1;
    const lobId =this.loggedInUser?.lobId || 1;
    const locationId =this.loggedInUser?.locationId || 1;
    this.loaderService.showLoader();
    this.useManagementService
      .fetchUserReportingLevelLookup({
        companyId: companyId,
        userId: userId,
        PrefixText: '',
        LOB_ID:lobId,
        location_ID:locationId,
      })
      .subscribe({
        next: (data: any) => {
          this.loaderService.hideLoader();
          if (data && data.message) {
            let lookItems = data.message as IFOSUserReportingLookup[];
            this.setUserReportingLevel = lookItems;
          }
        },
        error: (error: any) => {
          this.loaderService.hideLoader();
          this.toasterService.error(error.message, 'Error', { timeOut: 3000 });
        },
      });
  }

  onReportingLevelChange(event: any): void {
    const selectedValue = event.target.value;
    console.log('Selected Reporting Level:', selectedValue);
  }

  getUserDesignationLookup() {
    const companyId = this.loggedInUser?.companyId || 1; // Default to 1 if companyId is missing
    this.loaderService.showLoader();
    this.useManagementService
      .fetchUserDesignationtLookup({
        companyId: companyId,
      })
      .subscribe({
        next: (data: any) => {
          this.loaderService.hideLoader();
          if (data && data.message) {
            let lookItems = data.message as IFOSLookup[];
            this.setUserDesignationLevel = lookItems;
          }
        },
        error: (error: any) => {
          this.loaderService.hideLoader();
          this.toasterService.error(error.message, 'Error', { timeOut: 3000 });
        },
      });
  }


  handleMaritalStatusChange() {
    this.userPersonalDetails.get('maritalStatus')?.valueChanges.subscribe((status: string) => {
      const spouseNameControl = this.userPersonalDetails.get('spouseName');
      if (status === 'Married') {
        spouseNameControl?.setValidators(Validators.required);
      } else {
        spouseNameControl?.clearValidators();
      }
      spouseNameControl?.updateValueAndValidity();
    });
  }
  

  fetAllLookups() {
    this.getProspectLookup();
    this.getUserLevel();
    this.getUserDesignationLookup();
    this.getUserReportingLevel();
    // this.fetchLeadLookup();
  }

  back() {
    this.location.back();
  }

  save() {
    this.isSubmitted = true;
    if (this.userManagementForm.valid && this.userPersonalDetails.valid) {
      this.isSubmitted = false;
    }
  }

  fetchExistingUserDetails(userId: string): void {
    const companyId = this.loggedInUser?.companyId || 1; // Default to companyId 1 if not found
    const userIdAsNumber = Number(userId);

    if (this.userId) {
      this.loaderService.showLoader();

      this.useManagementService
        .fetchExistingUserDetails({
          userId: userIdAsNumber,
          companyId: companyId,
        })
        .subscribe({
          next: (data: any) => {
            if (data && data.message) {
              let lookItems = JSON.parse(
                localStorage.getItem('lookups')!
              ) as IFOSLookup[];
              this.SetLookups(lookItems);

              this.existingUserDetails =
                data.message as IExistinghUserRequestData;

              // Now setting form control values with null checks
              this.userManagementForm
                .get('userIdCode')!
                .setValue(this.existingUserDetails.userCode ?? null);
              this.userManagementForm
                .get('userName')!
                .setValue(this.existingUserDetails.userName ?? '');
              this.userManagementForm
                .get('gender')!
                .setValue(this.existingUserDetails.genderId ?? '');
              this.userManagementForm
                .get('password')!
                .setValue(this.existingUserDetails.password ?? '');
              this.userManagementForm
                .get('mobileNumber')!
                .setValue(this.existingUserDetails.mobileNumber ?? '');
              this.userManagementForm
                .get('emergencyContactNumber')!
                .setValue(this.existingUserDetails.emergencycontactNumber ?? '');

                const Dataofjoininhg = this.existingUserDetails.doj;
                if (Dataofjoininhg) {
                  this.userManagementForm
                    .get('joiningDate')!
                    .setValue(
                      this.utilityService.transformDate(
                        String(Dataofjoininhg),
                        'YYYY-MM-DD'
                      )
                    );            
                }
           
              this.userManagementForm
                .get('designation')!
                .setValue(this.existingUserDetails.designation ?? '');
              this.userManagementForm
                .get('userLevel')!
                .setValue(this.existingUserDetails.userLevel ?? '');
                this.userManagementForm
                .get('userGroup')!
                .setValue(this.existingUserDetails.userGroup || 'Admin');
              this.userManagementForm
                .get('reportingNextLevel')!
                .setValue(
                  this.existingUserDetails.reportingNextlevel ?? ''
                );
              this.userManagementForm
                .get('emailId')!
                .setValue(this.existingUserDetails.emailID ?? '');

              // // Handle the date conversion safely
              const birthDate = this.existingUserDetails.dateofbirth;
              if (birthDate) {
                this.userManagementForm
                  .get('dateOfBirth')!
                  .setValue(
                    this.utilityService.transformDate(
                      String(birthDate),
                      'YYYY-MM-DD'
                    )
                  );
                this.userManagementForm
                  .get('age')!
                  .setValue(
                    this.utilityService.getAge(String(birthDate)) ?? null
                  );
              } else {
                this.userManagementForm.get('dateOfBirth')!.setValue(null);
                this.userManagementForm.get('age')!.setValue(null);
              }

              // Bind personal details
              this.userPersonalDetails
                .get('fatherName')!
                .setValue(this.existingUserDetails.fatherName ?? '');
              this.userPersonalDetails
                .get('motherName')!
                .setValue(this.existingUserDetails.motherName ?? '');
              this.userPersonalDetails
                .get('maritalStatus')!
                .setValue(
                  this.existingUserDetails.maritiaStatuslID ?? ''
                );
              this.userPersonalDetails
                .get('aadharNumber')!
                .setValue(this.existingUserDetails.aadharNumber ?? '');
              this.userPersonalDetails
                .get('panNumber')!
                .setValue(this.existingUserDetails.panNumber ?? '');
                this.userPersonalDetails
                .get('spouseName')!
                .setValue(this.existingUserDetails.spouseName ?? '');
                
                //  this.userManagementForm.get('isActive')!.setValue(true);

                // this.userManagementForm.get('isActive')!.setValue(this.existingUserDetails.isActive === 1);
                const isActiveValue = this.existingUserDetails.isActive === 1;
                this.userManagementForm.get('isActive')!.setValue(isActiveValue);

                this.selectedImage=this.existingUserDetails.userImagepath ?? '';
                const RelivingDate = this.existingUserDetails.relivingDate;
                if (Dataofjoininhg) {
                  this.userManagementForm
                    .get('relivingDate')!
                    .setValue(
                      this.utilityService.transformDate(
                        String(RelivingDate),
                        'YYYY-MM-DD'
                      )
                    );            
                }
              this.loaderService.hideLoader();
            }
          },
          error: (error: Error) => {
            this.loaderService.hideLoader();
            let errorMessages = error.message.split('|');
            for (const key in errorMessages) {
              this.toasterService.error(errorMessages[key], 'Error', {
                timeOut: 2000,
              });
            }
          },
        });
    }
  }
 

  /**
 * Utility function to mark all fields in the form as touched
 * @param formGroup The form group to mark as touched
 */
markAllFieldsAsTouched(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    control?.markAsTouched({ onlySelf: true });
  });
}
  
  insertUser() {

    this.loaderService.showLoader();
    const companyId = this.loggedInUser?.companyId || 1;
  
    // Create request object
    const request = {
      // userID:0,
      companyId: companyId,
      userCode: this.userManagementForm.value.userIdCode,
      userName: this.userManagementForm.value.userName,
      genderId: this.userManagementForm.value.gender,
      password: this.userManagementForm.value.password,
      dOJ: this.userManagementForm.value.joiningDate,
      mobileNumber: this.userManagementForm.value.mobileNumber,
      emergencycontactNumber: this.userManagementForm.value.emergencyContactNumber,
      designation: this.userManagementForm.value.designation,
      userLevelID: this.userManagementForm.value.userLevel,
      reportingNextlevel: this.userManagementForm.value.reportingNextLevel,
      userGroup: this.userManagementForm.value.userGroup,
      emailID: this.userManagementForm.value.emailId,
      dateofbirth: this.userManagementForm.value.dateOfBirth,
      relivingDate: this.userManagementForm.value.relivingDate
      ? this.userManagementForm.value.relivingDate 
      : null,
      fatherName: this.userPersonalDetails.value.fatherName,
      motherName: this.userPersonalDetails.value.motherName,
      spouseName: this.userPersonalDetails.value.spouseName,
      maritialID: this.userPersonalDetails.value.maritalStatus,
      aadharNumber: this.userPersonalDetails.value.aadharNumber,
      panNumber: this.userPersonalDetails.value.panNumber,
      userImagepath: this.userImageFilepath,
      userImageContent: this.userImageFileContent,
      createdBy : parseInt(localStorage.getItem('User_ID') || '0', 10),
      address: '',

    } as IInsertUserDetails;
  
    // Add userID only in modify mode
  if (this.isEditMode && this.userId) {
    request.userID = Number(this.userId); // Convert userId to a number
  }
    // Log the request object
  
    // Call the service to insert or update user details
    this.useManagementService.insertUserDetails(request).subscribe({
      next: (data: any) => {
        this.loaderService.hideLoader();
  
        // Show a success message if API returns successfully
        if (data?.status === 0 && data?.error === null) {
          alert('User saved successfully!');
          this.userManagementForm.reset();
          this.userPersonalDetails.reset();
          // this.toasterService.success('User details updated successfully!', 'Success', {
          //   timeOut: 3000,
          // });
        } else {
          alert('Unexpected response from the server!');
          // this.toasterService.warning(data?.message || 'Unexpected response from the server.', 'Warning', {
          //   timeOut: 3000,
          // });
        }
        
  
        // Fetch all lookup data again
        this.fetAllLookups();
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        let errorMessages = error.message.split('|');
        for (const key in errorMessages) {
          this.toasterService.error(errorMessages[key], 'Error', {
            timeOut: 2000,
          });
        }
      },
    });
  }
  
}

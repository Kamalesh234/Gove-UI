import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  IAddress,
  ICreateProspectRequest,
  ICustomerProspectData,
  IFOSLookup,
  CompanyMasterFetch,
  CompanyMasterGet,
} from '../../../../../../../core/interfaces/app/request/IFOSModels';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../../../../data/services/shared/loader.service';
import { CompanyMaster } from '../../../../../../../data/services/feature/companyMaster/companymaster.service';

@Component({
  selector: 'app-company-master',
  templateUrl: './company-master.component.html',
  styleUrl: './company-master.component.scss',
})
export class CompanyMasterComponent implements OnInit {
  public companyMasterForm: FormGroup | any = new FormGroup({});
  public corporateDetailsForm: FormGroup | any = new FormGroup({});
  public otherDetailsForm: FormGroup | any = new FormGroup({});
  public loggedInUser: any = {};
  public companyMasterData: CompanyMasterGet = {} as CompanyMasterGet;
  public companyMasterDataFetch: CompanyMasterFetch = {} as CompanyMasterFetch;

  constructor(
    private loaderService: LoaderService,
    private companymasterservice: CompanyMaster,
    private toasterService: ToastrService,
  ) {}
  ngOnInit(): void {
    this.loaderService.showLoader();
    this.getCustomerProspect();
    this.formvalidation();
    this.companyMasterForm.disable();
    this.corporateDetailsForm.disable();
    this.otherDetailsForm.disable();
  }

  onSubmit() {}

  formvalidation() {
    this.companyMasterForm = new FormGroup({
      companyCode: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      constitutionalStatus: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
      companyAddress: new FormControl('', [Validators.required]),
    });

    this.corporateDetailsForm = new FormGroup({
      ceoName: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      telephoneNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
      systemAdminCode: new FormControl('', [Validators.required]),
      systemAdminPassword: new FormControl('', [Validators.required]),
      gstNumber: new FormControl('', [Validators.required]),
    });

    this.otherDetailsForm = new FormGroup({
      communicationAddress: new FormControl('', [Validators.required]),
      address1: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
      companyStartDate: new FormControl('', [Validators.required]),
      licenseNumber: new FormControl('', [Validators.required]),
      validityOfLicenseNumber: new FormControl('', [Validators.required]),
      incomeTaxNumber: new FormControl('', [Validators.required]),
      accountingCurrency: new FormControl('', [Validators.required]),
      remarks: new FormControl('', [Validators.required]),
    });
  }

  getCustomerProspect() {
    this.loaderService.showLoader();
    const companyid = this.loggedInUser?.companyId || 1;
    this.companymasterservice
      .fetchCompanyMaster({
        companyId: companyid,
      })
      .subscribe({
        next: (data: any) => {
          if (data && data.message) {
            let lookItems = JSON.parse(
              localStorage.getItem('lookups')!
            ) as CompanyMasterFetch;
            // this.SetLookups(lookItems);
            this.companyMasterData = data.message as CompanyMasterGet;
            this.companyMasterForm
              .get('companyCode')!
              .setValue(this.companyMasterData.companyCode);

            this.companyMasterForm
              .get('companyName')!
              .setValue(this.companyMasterData.companyName);

            this.companyMasterForm
              .get('constitutionalStatus')!
              .setValue(this.companyMasterData.constitutionalStatus);

            this.companyMasterForm
              .get('city')!
              .setValue(this.companyMasterData.city);

            this.companyMasterForm
              .get('state')!
              .setValue(this.companyMasterData.state);

            this.companyMasterForm
              .get('country')!
              .setValue(this.companyMasterData.country);

            this.companyMasterForm
              .get('pincode')!
              .setValue(this.companyMasterData.zipCode);

            this.companyMasterForm
              .get('companyAddress')!
              .setValue(this.companyMasterData.companyAddress);

            this.corporateDetailsForm
              .get('ceoName')!
              .setValue(this.companyMasterData.cdCeoHeadName);

            this.corporateDetailsForm
              .get('mobileNumber')!
              .setValue(this.companyMasterData.cdMobileNumber);

            this.corporateDetailsForm
              .get('telephoneNumber')!
              .setValue(this.companyMasterData.cdTelephoneNumber);

            this.corporateDetailsForm
              .get('email')!
              .setValue(this.companyMasterData.cdEmailId);

            this.corporateDetailsForm
              .get('website')!
              .setValue(this.companyMasterData.cdWebsite);

            this.corporateDetailsForm
              .get('systemAdminCode')!
              .setValue(this.companyMasterData.cdSysAdminUserCode);

            this.corporateDetailsForm
              .get('gstNumber')!
              .setValue(this.companyMasterData.gstNumber);

            this.otherDetailsForm
              .get('communicationAddress')!
              .setValue(this.companyMasterData.odCommunicationAddress);

            this.otherDetailsForm
              .get('address1')!
              .setValue(this.companyMasterData.odAddress1);

            this.otherDetailsForm
              .get('city')!
              .setValue(this.companyMasterData.city);

            this.otherDetailsForm
              .get('state')!
              .setValue(this.companyMasterData.state);

            this.otherDetailsForm
              .get('country')!
              .setValue(this.companyMasterData.country);

            this.otherDetailsForm
              .get('pincode')!
              .setValue(this.companyMasterData.odZipCode);

            this.otherDetailsForm
              .get('companyStartDate')!
              .setValue(this.companyMasterData.odDateOfIncorporation);

            this.otherDetailsForm
              .get('licenseNumber')!
              .setValue(this.companyMasterData.odRegLicNumber);

            this.otherDetailsForm
              .get('validityOfLicenseNumber')!
              .setValue(this.companyMasterData.odValidityOfRegLicNumber);

            this.otherDetailsForm
              .get('incomeTaxNumber')!
              .setValue(this.companyMasterData.odIncomeTaxPanNumber);

            this.otherDetailsForm
              .get('accountingCurrency')!
              .setValue(this.companyMasterData.currency);

            this.otherDetailsForm
              .get('remarks')!
              .setValue(this.companyMasterData.odRemarks);
          }
          this.loaderService.hideLoader();
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

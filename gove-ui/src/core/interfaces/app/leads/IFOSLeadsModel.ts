import { IAddress } from '../request/IFOSModels';

export interface ILeadProspectDetail {
  prospectId?: number;
  prospectName?: string;
  leadType?: string;
  leadTypeName?: string;
  prospectAddress?: string;
  mobileNumber?: string;
  vehicleNumber?: string;
  aadharNumber?: string;
  panNumber?: string;
  locationId?: number;
  locationName?: string;
  prospectTypeId?: number;
  prospectTypeDescription?: string;
  prospectDateOfBirth?: Date;
  prospectDate?: Date;
}

export interface IFOSLeadStatus {
  statusId?: number;
  statusDescription?: string;
}

export interface ILeadApprovalDetail {
  approvalDetailId?: number;
  approvalHeaderId?: number;
  leadDataLookupTypeId?: number;
  leadDataLookupValueId?: number;
  financeAmount?: number;
  tenure?: number;
  rate?: number;
}

export interface ILeadApprovalHeader {
  approvedPersonLookupTypeId?: number;
  approvedPersonLookupValueId?: number;
  approvalStatusLookupTypeId?: number;
  approvalStatusLookupValueId?: number;
  approvalRemarks?: string;
  approvedDate?: Date;
  approvedBy?: number;
  approvedOn?: Date;
  isRevoked?: boolean;
  revokedBy?: number;
  revokedOn?: Date;
  revokedReason?: string;
  approvalDetails?: ILeadApprovalDetail[];
}

export interface ILeadAssetDetail {
  assetClassId?: number;
  assetClassDescription?: string;
  assetMakeId?: number;
  assetMakeDescription?: string;
  assetTypeId?: number;
  assetTypeDescription?: string;
  assetModelId?: number;
  engineNumber?: string;
  vehicleNumber?: string;
  chasisNumber?: string;
  serialNumber?: string;
  ownershipLookupTypeId?: number;
  ownershipLookupValueId?: number;
  ownershipDescription?: string;
  model?: string;
  vehicleTypeLookupTypeId?: number;
  vehicleTypeLookupValueId?: number;
  vehicleTypeDescription?: string;
  taxTypeLookupTypeId?: number;
  taxTypeLookupValueId?: number;
  taxTypeDescription?: string;
  fuelTypeLookupTypeId?: number;
  fuelTypeLookupValueId?: number;
  fuelTypeDescription?: string;
  modelDescription?: string;
}

export interface ILineOfBusiness {
 lobId?:number;
 lobName?:string
}

export interface IFieldExecutive {
  fieldExecutiveId?:number;
  fieldExecutiveName?:string
 }

export interface ILeadFollowUpDetail {
  followupId?: number;
  activityDescription?: string;
}

export interface ILeadGuarantor {
  genderId?: number;
  guarantorTypeLookupTypeId?: number;
  guarantorTypeLookupValueId?: number;
  guarantorTypeDescription?: string;
  guarantorRelationshipLookupTypeId?: number;
  guarantorRelationshipLookupValueId?: number;
  guarantorRelationshipDescription?: string;
  guarantorAmount?: number;
  guarantorName?: string;
  guaranterDateOfBirth?: Date;
  mobileNumber?: string;
  alternateMobileNumber?: string;
  email?: string;
  website?: string;
  aadharNumber?: string;
  aadharImagePath?: string;
  aadharImageContent?: string;
  panNumber?: string;
  panImagePath?: string;
  panImageContent?: string;
  guarantorImagePath?: string;
  guarantorImageContent?: string;
  prospectId?: number;
  prospectCode?: string;
  communicationAddress?: IAddress;
  permanentAddress?: IAddress;
}

export interface ILeadHeader{
    leadId?:number;
    prospectId?:number;
    leadNumber?:string;
    leadDate?:Date;
    leadTypeLookupTypeId?:number;
    leadTypeLookupValueId?:number;
    financeAmount?:number;
    tenure?:number;
    tenureLookupTypeId?:number;
    tenureLookupTypeDescription?:string;
    tenureLookupValueId?:number;
    rate?:number;
    salesPersonId?:number;
    repaymentFrequencyLookupTypeId?:number;
    repaymentFrequencyDescription?:string;
    repaymentFrequencyLookupValueId?:number;
    vehicleRegistrationNumber?:string;
    leadCurrentStatusId?:number;
    cancelledBy?:number;
    cancelledDate?:Date;
    cancellationRemarks?:string;
    leavePeriod?:number;
    documentCategoryId?:number;
    documentName?:string;
    fieldExecutiveId?:number;
    fieldExecutiveName?:string;
    leadCurrentStatusDescription?:string;
}

export interface ILeadIndividualDetail{
    houseLookupTypeId?:number;
    houseLookupValueId?:number;
    houseTypeDescription?:string;
    doorFloorNumber?:string;
    houseStatusLookupTypeId?:number;
    houseStatusLookupValueId?:number;
    houseStatusDescription?:string;
    maritialStatusLookupTypeId?:number;
    maritialStatusLookupValueId?:number;
    maritialStatusDescription?:string;
    fatherName?:string;
    motherName?:string;
    spouseName?:string;
    employmentLookupTypeId?:number;
    employmentLookupValueId?:number;
    employmentTypeDescription?:string;
    spouseEmploymentLookupTypeId?:number;
    spouseEmploymentLookupValueId?:number;
    spouseEmploymentDescription?:string;
    adultDependents?:number;
    childDependents?:number;
    ownTwoWheeler?:number;
    ownFourWheeler?:number;
    ownHeavyVehicle?:number;
    monthlySalary?:number;
    spouseSalary?:number;
    houseRentalAmount?:number;
    existingLoanCount?:number;
    existingLoanEmi?:number;
    leadRemarks?:string;
}

export interface ILeadNonIndividualDetail{
    publicCloselyLookupTypeId?:number;
    publicCloselyLookupValueId?:number;
    publicCloselyDescription?:string;
    directorCount?:number;
    listedExchange?:string;
    paidUpCapital?:number;
    faceValueShare?:string;
    bookValueShare?:number;
    businessProfile?:string;
    geographicalCoverage?:string;
    branchCount?:number;
    institutionLookupTypeId?:number;
    institutionLookupValueId?:number;
    promoterStakePercentage?:number;
    spouseEmploymentLookupValueId?:number;
    jvPartnerName?:string;
    jvPartnerPercentage?:number;
    ceoName?:string;
    ceoDateofBirth?:Date;
    ceoWeddingDate?:Date;
    ceoExperience?:number;
    residentialAddress?:string;
    industryLookupTypeId?:number;
    industryLookupValueId?:number;
    industryDescription?:string;
}

export interface ILead{
    companyId:number;
    userId:number;
    lobId:number;
    lobDescription?:number;
    leadDate?:Date;
    locationId?:number;
    customerId?:number;
    customerCode?:string;
    header?:ILeadHeader;
    individualDetail?:ILeadIndividualDetail;
    nonIndividualDetail?:ILeadNonIndividualDetail;
    guarantors?:ILeadGuarantor[];
    followUps?:ILeadFollowUpDetail[];
    asset?:ILeadAssetDetail;
    approval?:ILeadApprovalHeader;
    leadProspectDetail?:ILeadProspectDetail;
}

export interface ILeadTranslanderRequest{
  companyId?:number;
  userId?:number;
  status?:string;
  leadNumber?:string;
  vehicleNumber?:string;
  currentPage?:number;
  pageSize?:number;
  searchValue?:string;
}
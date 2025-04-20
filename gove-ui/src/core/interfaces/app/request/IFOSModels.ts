import IFOSTableColumn from '../../IFOSTableColumn';
// import {IFOSButtonProps} from "../../IFOSButtonProps";
import { FOSPageViewMode } from '../../../common/enum';

/**
 * Interface for Branch Locations
 */
export interface IFOBranchLocation {
  locationId: number;
  locationName: string;
}

/**
 * Interface for Lookup.
 */
export interface IFOSLookup {
  lookupTypeId: number;
  lookupTypeDescription: string;
  lookupValueId: string;
  lookupValueDescription: string;
}
export interface IGoveBranchLookup {
  lookupValueId: number;
  lookupValueDescription: string;
}
export interface IGoveEMPCodeLookup {
  staffan: number;
  usercode: string;
  staffname:string;
}
export interface IFOSUserReportingLookup {
  userID: number;
  userName: string;
}
/**
 * Interface for basic info
 */
export interface IFOSRequestBasicInfo {
  requestId: number;
  requestDate: string;
  dealNumber: string;
  dealName: string;
  lobName: string;
  industryGroup: string;
  dealStage: string;
  clientNames: string;
  subjectNames: string;
  statusName: string;
  requesterName: string;
  isIncremental: boolean;
  isNdaActive: boolean;
  isRetainedInCourt: boolean;
  hasAdverseClients: boolean;

  jobType: string; // Todo - Need to check this
  dealType: string; // Todo - Need to check this
}

/**
 * Interface for Interested Parties for New/View request
 */
export interface IFOSInterestedParty {
  tableSettings: IFOSInterestedPartyTableSettings; // Note: Filter Type and Actions needs to be set from Parent component
  data: IFOSInterestedPartyData[]; // Todo - While Integrating with API, sort the data by interested party name
  // buttons: IFOSButtonProps[];
  viewMode: FOSPageViewMode;
}

/**
 * Interface for Interested Party Table Settings
 */
export interface IFOSInterestedPartyTableSettings {
  columnConfig: IFOSTableColumn[];
  paginator: boolean;
  rowsPerPageOptions: number[];
  rowsPerPages: number;
  sortField: string;
  sortOrder: number;
}

/**
 * Interface for Interested party data
 */
export interface IFOSInterestedPartyData {
  id: number;
  companyName: string;
  individualPrefix: string;
  individualFirstName: string;
  individualLastName: string;
  individualMiddleName: string;
  individualSuffix: string;
  explanation: string;
  position: string;
  interestedPartyName: string;
}

/**
 * Interface for Matched Companies
 */
export interface IFOSMatchedCompanies extends IFOSInterestedPartyData { }

/**
 *
 */
export interface IFOSInterestedPartyPageView {
  pageNumber: number;
  pageData: IFOSInterestedPartyData[];
}

/**
 * Interface for Prev and Subsequent Conflict Checks
 */
export interface IFOSConflictCheck {
  requestTypeName: string;
  isIncremental: boolean;
  submittedDate: string;
  statusName: string;
  requestId: number;
}

/**
 * Interface for FSCG Account
 */
export interface IFOSFscgAccount {
  requestId: number;
  accountId: number;
  accountName: string;
}

/**
 * Interface for Question Answers
 */
export interface IFOSQuestionAnswer {
  questionId: number;
  questionText: string;
  answerText: string;
  answerExplanation: string;
  requestId: number;
}

/**
 * Interface for Comment History
 */
export interface IFOSCommentHistory {
  comment: string;
}

/**
 * Interface for View Request Page
 */
export interface IFOSViewRequestPage {
  prevConflictCheck: IFOSConflictCheck[];
  subsequentConflictCheck: IFOSConflictCheck[];
  interestedParties: IFOSInterestedPartyPageView[];
}

export interface IBranchLocationRequest {
  userId?: number;
  companyId?: number;
  lobId?: number;
  isActive?: boolean;
}

export interface ICustomerProspectRequest {
  userId?: number;
  companyId?: number;
  prospectId?: number;
  mobileNumber?: string;
  aadharNumber?: string;
  panNumber?: string;
}

export interface CompanyMasterFetch {
  companyId: number
}

export interface CompanyMasterGet {
  companyId: number,
  company_Code: string,
  companyName: string,
  companyAddress: string,
  city: string,
  state: string,
  country: string,
  zipCode: number,
  constitutionalStatusId: number,
  cdceoHeadName: string,
  cdTelephoneNumber: number,
  cdMobileNumber: number,
  cdEmailID: string,
  cdWebsite: string,
  cdSysAdminUserCode: string,
  cdSysAdminUserPassword: string,
  gsT_Number: string,
  odCommunicationAddress: string,
  odAddress1: string,
  odCity: string,
  odState: string,
  odCountry: string,
  odZipCode: number,
  odDateOfIncorporation: Date,
  odRegLicNumber: number,
  odValidityOfRegLicNumber: Date,
  odIncomeTaxPanNumber: string,
  currency: string,
  oD_Remarks: string,
  active: number,
  constitutional_Status: string
}

export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  stateId: number;
  countryId: number;
  pincode: string;
}
export interface ICustomerProspectData {
  companyId?: number;
  prospectId?: number;
  prospectCode?: string;
  locationId?: number;
  locationDescription?: string;
  dateofBirth?: Date;
  prospectDate?: Date;
  prospectTypeId?: number;
  customerId?: number;
  customerCode?: string;
  genderId?: number;
  genderName?: string;
  prospectName?: string;
  mobileNumber?: string;
  alternateMobileNumber?: string;
  website?: string;
  email?: string;
  communicationAddress?: IAddress;
  permanentAddress?: IAddress;
  aadharNumber?: string;
  aadharImagePath?: string;
  aadharImageContent?:string;
  panNumberImageContent?:string;
  prospectImageContent?:string;
  panNumber?: string;
  panNumberImagePath?: string;
  prospectImagePath?: string;
}

export interface ICreateProspectRequest {
  userId: number;
  prospect: ICustomerProspectData;
}

export interface IUserLevelLookupRequest {
  userId?: number;
  companyId?: number;
}

export interface IUserReportingLevelLookupRequest {
  userId?: number;
  companyId?: number;
  PrefixText?: string;
  LOB_ID?:number;
  location_ID?:number;
}

export interface IUserDesignationLookupRequest {
  companyId?: number;
}
export interface IBranchLookupRequest {
  companyId?: number;
  userId?: number;
  options?:number;
}

export interface IExistinghNpareportsRequestData {
  npA_Month?: string;
  panum? : string;
  location_Description?: string;
  customer_Code?: string;
  customer_Name?: string;
  product_Type?: string;
  category?: string;
  customer_PAN?: string;
  arrear_InstallmentStartdate?:string;
  last_ReceiptDate?:string;
  arrear_PrincipalAmount?:string;
  arrear_InterestAmount?:string;
  future_PrincipalAmount?:string;
  principal_Outstanding?:string;
  npA_Days?:string;
  npA_Percentage?:string; 
  npA_Provision?:string; 
  npA_MarkedDate?:string;
  created_By?: string;
  created_On?:string;
  summary_Branch?:string; 
  branch_Count? : number;
  branch_GrossNPA? : string;
  branch_provision? : string;
  branch_NetNPA? : string;
  branch_Aum? : string;
  branch_Gnpa? : string;
  branch_Nnpa? : string;
  summary_Segment?:string; 
  segment_Count? : number;
  segment_GrossNPA? : string;
  segment_provision? : string;
  segment_NetNPA? : string;
  segment_Aum? : string;
  segment_Gnpa? : string;
  segment_Nnpa? : string;
  summary_Subsegment?:string; 
  subsegment_Count? : number;
  subsegment_GrossNPA? : string;
  subsegment_provision? : string;
  subsegment_NetNPA? : string;
  subsegment_Aum? : string;
  subsegment_Gnpa? : string;
  subsegment_Nnpa? : string;

  loanAccount_Number?:string;
  vehicle_Number?:string;
  branch?:string;
  customer_Mobile?:string;
  contno?:string;
  dMinDt?:string;
  lstRefdt?:string;
  dfaRv?:string;
  dfcRv?:string;
  ffaRv?:string;
  os?:string;
  dpD_Days?:string;
  percteage?:string;

  iNo?:string;
  dueDt?:string;
  dueAmount?:string;
  faRv?:string;
  fcRv?:string;
  refNo?:string;
  refDt?:string;
  refAmt?:string;
  faRd?:string;
  fcRd?:string;
  odDy?:string;
  odcRv?:string;
  odcRd?:string;
  bcRv?:string;
  bcRd?:string;
}

export interface IExistinghNpasummaryRequest {
  userId?: number;
  companyId?: number;
  accountnumber?:string;
  branch?:string;
  segment?:string;
  subsegment?:string;
  cutoffdate?:string;
  options?:number;
}
export interface IExistinghSMARequest {
  userId?: number;
  companyId?: number;
  branch?:string;
  smatype?:string;
  employeecode?:string;
  cutoffdate?:string;
  options?:number;
  schedule_ID?:number;
  buckettype?:string;
  maturitytype?:string;
}

export interface IExistinghSMARequestData{
  Branch?:string;
  Panum?:string;
  CustomerName?:string;
  Category?:string;
  ProductType?:string;
  Model?:string;
  Due_Date?:string;
  EMI_Count?:string;
  CurrentEMI?:string;
  PaidEMI?:string;
  OverDue?:string;
  Emiamount?:string;
  OverDueEMIAmount?:string;
  ODCharges?:string;
  Demand?:string;
  Colln?:string;
  CollectableAmount?:string;
  Executive?:string;
  DPD_Days?:string;
  DMinDt?:string;
  SMAStatus?:string;

}
export interface IExistinghCollectionRequestData{
  Branch?:string;
  Panum?:string;
  CustomerName?:string;
  Proposalno?:string;
  CCode?:string;
  Category?:string;
  ProductType?:string;
  Due_Date?:string;
  EMI_Count?:string;
  CurrentEMI?:string;
  PaidEMI?:string;
  Bank_Charges?:string;
  OverDue?:string;
  Bucket?:string;
  Emiamount?:string;
  OverDueEMIAmount?:string;
  ODCharges?:string;
  Demand?:string;
  CollectableAmount?:string;
  Executive?:string;
  FieldExecutive_Code?:string;
  DPD_Days?:string;
  DMinDt?:string;
  AccountStatus?:string;
  SubCategory?:string;

}
export interface IExistinghMISRequestData{
  Branch_Name?:string; 
  Contract_Number?:string; 
  Disb_Date?:string;
  Contract_Date?:string; 
  Maturity_Date?:string; 
  Due_Date?:string; 
  Proposal_Number?:string;
  FirstEMI_Date?:string;
  Advance_Arrear?:string; 
  CCode?:string;
  Customer_Name?:string; 
  Customer_Pan?:string;
  Moratorium?:string;
  REGN_Number?:string; 
  Vehicle_Category?:string; 
  Sub_Category?:string; 
  ManYr?:string; 
  Vehicle_ProductType?:string; 
  LTVPerc?:string; 
  IRR?:string; 
  FAAMT?:string; 
  FCAMT?:string;
  LinsFA?:string; 
  LinsFC?:string; 
  DOCCHGS?:string; 
  AdminChgs?:string; 
  FieldExecutive_Name?:string; 
  FieldExecutive_Code?:string; 
  HypothecatedTo?:string; 
  EMI_Count?:string; 
  CurrentMonth_EMI?:string; 
  Paid_EMICount?:string; 
  Arrear_EMICount?:string; 
  CurrentMonth_EMIAmount?:string; 
  DPD_Days?:string; 
  Principal_Oustanding?:string; 
  Interest_Outstanding?:string; 
  LTDFA?:string; 
  LTDFC?:string; 
  DFARv?:string; 
  DFCRv?:string; 
  FFARv?:string; 
  FFCRv?:string; 
  AdvRd?:string; 
  Last_receipt_Date?:string; 
  DMinDt?:string; 
  PODRv?:string; 
  PODCRv?:string; 
  PODDays?:string; 
  PODCnt?:string; 
  ODCRv?:string; 
  BCRv?:string; 
  LTDODC?:string; 
  LTDBC?:string; 
  PBCRv?:string; 
  AccountStatus?:string; 
  Source?:string; 
  SName?:string; 
  Payout?:string; 
  PSL?:string; 
  RiskCatg?:string; 
  oneto7Days_principle?:string; 
  oneto7Days_interest?:string; 
  nightto14Days_principle?:string; 
  nightto14Days_interest?:string; 
  d15to30Days_principle?:string; 
  d15to30Days_interest?:string; 
  d31to60Days_principle?:string; 
  d31to60Days_interest?:string; 
  d61to90Days_principle?:string; 
  d61to90Days_interest?:string; 
  d91to180Days_principle?:string; 
  d91to180Days_interest?:string; 
  d181to365Days_principle?:string; 
  d181to365Days_interest?:string; 
  d1to3Years_principle?:string; 
  d1to3Years_interest?:string; 
  d3to5Years_principle?:string; 
  d3to5Years_interest?:string; 
  Morethan5Years_principle?:string; 
  Morethan5Years_interest?:string;

}
export interface IExistinghSalesreportsRequestData {
  User?:string;
  errorcode?:string;
  IncentiveMonth?:string;
  Branch?:string;
  StaffCode?:string;
  StaffName?:string;
  TargetAmount?:string;
  BusinessAmount?:string;
  IncentiveCAPAmount?:string;
  BusinessArcheivedPercentage?:string;
  BusinessIncentiveAmount?:string;
  IRRArcheivedPercentage?:string;
  IRRIncentiveAmount?:string;
  FOSArcheivedPercentage?:string;
  FOSIncentiveAmount?:string;
  TotalIncnetiveAmount?:string;
  Designation?:string;
  ContractCount?:string;
  IncentiveAmount?:string;
}
export interface IExistinghCollectionreportsRequestData {
  User?:string;
  Date?:string;
  Dates?:string;
  Branch?:string;
  UserCode?:string;
  ManagerName?:string;
  ContractCount?:string;
  OpeningDemand?:string;
  CollectionAmount?:string;
  EfficiencyPercentage?:string;
  IncentiveAmount1?:string;
  Zeroto2BucketOpeningCount?:string;
  Zeroto2BucketClosingCount?:string;
  Zeroto2_EfficiencyPercentage?:string;
  IncentiveAmount2?:string;
  Zero_BucketDemand?:string;
  Zero_BucketCollection?:string;
  Zero_Efficiency_Percentage?:string;
  IncentiveAmount_3?:string;
  Two_BucketDemand?:string;
  Two_BucketCollection?:string;
  Two_EfficiencyPercentage?:string;
  IncentiveAmount_4?:string;
  GrossNPAAmount?:string;
  TotalAUMAmount?:string;
  GNPAPercentage?:string;
  IncentiveAmount_5?:string;
  TotalIncentiveAmount?:string;
  StaffName?:string;
}
export interface IExistinghNpahistoryRequest {
  userId?: number;
  companyId?: number;
  options?:number;
  accountnumber?:string;
  fromdate?:string;
  todate?:string;
  
}

export interface IExistinghNpahistoryRequestData{
  panum?:string;
  npA_Process_Date?:string;
  npA_Entry_Date?:string;
  npA_Exit_Date?:string;
  npaCategory?:string;
  dMinDt?:string;
  dueAmount?:string;
  dpD_Days?:string;
}
export interface IExistinghUserRequest {
  userId?: number;
  companyId?: number;
}

export interface IExistinghUserRequestTranslander {
  userId?: number;
  companyId?: number;
}

export interface IExistinghUserRequestTranslanderData {
  userID?: number;
  userCode?: string;
  userName?: string;
  emailID?: string;
  designation?: string;
  userlevel?: string;
  // mobileNumber?: string;
  // companyId?: string;
}

export interface IExistinghUserRequestData {
  companyId?: number;
  userID?: number;
  userCode?: string;
  userName?: string;
  genderId?: number;
  genderName?: string;
  password?: string;
  doj?: Date;
  relivingDate?:Date;
  mobileNumber?: string;
  emergencycontactNumber?: string;
  designation?: number;
  userLevelID?: number;
  userLevel?: string;
  reportingNextlevel?: number;
  ReportingGHigherLevel?: string;
  maritiaStatuslID?: string;
  userGroup?: number;
  emailID?: string;
  dateofbirth?: Date;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  maritialID?: string;
  aadharNumber?: string;
  panNumber?: number;
  address?: string;
  userImagepath?: string;
  isActive?: number;
}

export interface IExistinghUserRequestDatas {
  companyId?: number;
  userID?: number;
  userCode?: string;
  userName?: string;
  genderId?: number;
  genderName?:string;
  password?: string;
  doj?: Date;
  relivingDate?:Date;
  mobileNumber?: string;
  emergencycontactNumber?: string;
  designation?: number;
  userLevelID?: number;
  userLevel?:string;
  reportingNextlevel?: number;
  ReportingGHigherLevel?:string;
  marutialStatusDiscription?:string;
  userGroup?: number;
  emailID?: string;
  dateofbirth?: Date;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  maritialID?: number;
  aadharNumber?: string;
  panNumber?: number;
  address?: string;
  userImagepath?: string;
  isActive?: number;
}
export interface IInsertUserDetails {
  companyId?: number;
  userID?: number;
  userCode?: string;
  userName?: string;
  genderId?: number;
  password?: string;
  doj?: Date;
  mobileNumber?: string;
  emergencycontactNumber?: number;
  designation?: string;
  userLevelID?: number;
  relivingDate?:Date;
  reportingNextlevel?: number;
  userGroup?: number;
  emailID?: string;
  dateofbirth?: Date;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  maritialID?: number;
  aadharNumber?: string;
  panNumber?: string;
  address?: string;
  userImagepath?: string;
  userImageContent?: string;
  isActive?: boolean;
  createdBy?: number;
  errorCode?: number;
}

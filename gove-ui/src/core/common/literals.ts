import { IFOSStatus } from '../interfaces/IFOSMyRequest';

/**
 * Literals related to web/http
 */
export const Web = {
  HttpStatusCode: {
    BadRequest: 400,
    Conflict: 409,
    Duplicate: 422,
    Forbidden: 403,
    Gone: 410,
    InternalServerError: 500,
    NotFound: 404,
    Ok: 200,
    Unauthorized: 401,
  },

  HttpStatusMessage: {
    Ok: 'Success',
    BadRequest: 'Bad Request',
    Unauthorized: 'Unauthorized',
    Forbidden: 'Forbidden',
    NotFound: 'NotFound',
    Duplicate: 'Duplicate',
    InternalServerError: 'InternalServerError',
  },
};

export const Characters = {
  ForwardSlash: '/',
};

/**
 * Literals related to Conflicts Check roles
 */
export const FOSRoles = {
  NO_ROLE_ASSIGNED: 'no_role_assigned',
  CONFLICT_ADMIN: 'conflict_admin',
  LEGAL_COMMITTEE_MEMBER: 'legal_committee_member',
  SYSTEM_ADMINISTRATOR: 'system_admin',
};

/**
 * Literals related to Conflicts Check permissions
 */
export const FOSPermissions = {
  LDCCR: 'LDCCR',
  FVA_LITIGATION: 'FVA',
};

/**
 * Literals related to Conflicts Check pages
 */
export const FOSPages = {
  MY_REQUESTS: 'pages.myRequests',
  SYSTEM_ADMINISTRATION: 'pages.systemAdministration',
  SEARCH_SUBMITTED_REQUESTS: 'pages.searchSubmittedRequests',
  RESUBMIT_SEARCH: 'pages.resubmitSearch',
  USER_ADMINISTRATION: 'pages.userAdministration',
  MANAGE_HOLIDAYS: 'pages.manageHolidays',
  DELETED_REQUESTS: 'pages.deletedRequests',
  MANAGE_FOS_LEGAL_ENTITIES: 'pages.manageHlLegalEntities',
  MANUAL_ARCHIVE: 'pages.manualArchive',
  MATRIX_TEST: 'pages.matrixTest',
  CF_QUESTION_AUDIT: 'pages.cfQuestionAudit',
};

/*
 * Query Param value for CC API
 * **/
export const FOSCCApiQueryParams = {
  CONFIG_API: {
    MY_REQUEST_SEARCH_SETTINGS:
      'ConflictsCheck:AppConfiguration:UIConfiguration:MyRequests:Settings:SearchSettings',
    MY_REQUEST_TABLE_SETTINGS:
      'ConflictsCheck:AppConfiguration:UIConfiguration:MyRequests:Settings:TableSettings',
    MY_REQUEST_DATETIMES_SETTINGS:
      'ConflictsCheck:AppConfiguration:UIConfiguration:MyRequests:Settings:DateTimeSettings',
    MY_REQUEST_ACCESS_TOKEN:
      'ConflictsCheck:AppConfiguration:LoggerConfiguration:Providers:0:AccessToken',
    REQUEST_TABS_SETTINGS:
      'ConflictsCheck:AppConfiguration:UIConfiguration:Requests:Settings:RequestTabSettings',
  },
};

/*
 * Literals for the API end points
 * **/
export const FOSApiEndPoints = {
  PROSPECT_LOOKUP_API: '/api/Prospects/GetProspectLookup',
  BRANCH_LOOKUP_API: '/api/Prospects/GetBranchLocations',
  STATES_LOOKUP_API: '/api/Prospects/GetStates',
  EXISTING_PROSPECT_API: '/api/Prospects/GetExistingProspectDetailsForCustomer',
  CREATE_PROSPECT_API: '/api/Prospects/CreateNewProspect',
  USER_CONFIG_LOCAL: '/core/config/user-config.json',
  TAB_CONFIG_LOCAL: '/core/config/tab-config.json',
  NAV_MENU_LOCAL: '/core/config/nav-menu.json',
  LANGUAGE_LOCAL: '/core/config/language.json',
  REQUESTERS_API: '/requesters',
  EXPORT_MY_REQUESTS: '/my-requests/export',
  USER_SETTINGS_API: '/user-settings',
  TAB_CONFIG_API: '/tab-config',
  REQUEST_API: '/requests/',
  REQUEST_INTERESTED_PARTY_API: '/request/:id/interested-parties',
  INTERESTED_PARTY_CONFIG_LOCAL: '/core/config/interested-party-config.json',
  USER_LOGIN_API: '/api/Auth/GetUserByUserNameAndPassword',
  USER_REFRESH_TOKEN_API: '/api/Auth/RefreshToken',
  SIDEBAR_API: '/api/Home/GetUserMenus/{userId}',
  COMPANY_MASTER_FETCH_API: '/api/Prospects/GetCompanyMasterDetails',
  EXPORT_PROSPECTS:
    '/api/Prospects/ExportProspectData?fileOutputType={fileOutputType}',
  GET_DOCUMENT_CATEGORIES:
    '/api/Prospects/GetDocumentCategories?companyId={companyId}&userId={userId}',
  Users: {
    USER_LEVEL_LOOKUP_API: '/api/UserManagement/GetUserlevelLookup',
    USER_REPORTING_LEVEL_LOOKUP_API:
      '/api/UserManagement/GetUserreportinglevel',
    USER_DESIGNATION_LOOKUP_API: '/api/UserManagement/GetUserdesignationlevel',
    USER_INSERT_API: '/api/UserManagement/UserInsert',
    USER_EXISTING_DETAILS_API: '/api/UserManagement/GetExistingUserDetails',
    USER_EXISTING_DETAILS_TRANSLANDER_API:
      '/api/UserManagement/GetUserTranslander',
  },
  Leads: {
    GET_ASSETLOOKUP: '/api/Leads/GetAssetLookup',
    GET_LEADDETAILS: '/api/Leads/GetLeadDetails',
    GET_LEADSTATUSES: '/api/Leads/GetLeadStatuses',
    GET_LEADTRANSLANDERDETAILS: '/api/Leads/GetLeadTranslanderDetails',
    GET_LEAD_GENERATION_LOOKUP:
      '/api/Leads/GetLeadGenerationLookup/{companyId}/{userId}',
    GET_PROPSPECT_DETAILS_FOR_LEAD: '/api/Leads/GetProspectDetailsForLead',
    CREATE_GUARANTOR_DETAILS: '/api/Leads/CreateGuarantorData',
    CREATE_LEAD_DETAILS: '/api/Leads/CreateLeadDetails',
    CREATE_LEAD_NON_INDIVIDUAL_RECORD: '/api/Leads/CreateNonIndividualDetail',
    CREATE_LEAD_INDIVIDUAL_RECORD: '/api/Leads/CreateLeadIndividualDetails',
    CREATE_LEAD_GENERATION_HEADER: '/api/Leads/CreatetLeadGenerationHeader',
    GET_LINEOFBUSINESSES:
      '/api/Leads/GetLineOfBusinesses?companyId={companyId}&userId={userId}',
    GET_FIELDEXECUTIVES:
      '/api/Leads/GetFieldExecutives?companyId={companyId}&userId={userId}&prefix=FOS',
  },
  Fvr: {
    GET_FVR_HIRER_LOOKUP:
      '/api/FieldVerification/GetFvrHirerLookup?companyId={companyId}&userId={userId}',
    GET_FVR_ASSET_LOOKUP:
      '/api/FieldVerification/GetFvrAssetLookup?companyId={companyId}&userId={userId}',
    GET_FVR_NEIGHBOUR_LOOKUP:
      '/api/FieldVerification/GetFvrNeighbourLookup?companyId={companyId}&userId={userId}',
    GET_FVR_NEIGHBOURHOOD_DETAILS:
      '/api/FieldVerification/GetFvrNeighbourHoodDetails?companyId={companyId}&userId={userId}&leadId={leadId}&fieldVerificationId={fieldVerificationId}',
    GET_LEAD_ASSET_DETAILS:
      '/api/FieldVerification/GetLeadAssetDetails?companyId={companyId}&userId={userId}&leadNumber={leadNumber}&vehicleNumber={vehicleNumber}',
    GET_LEAD_HIRER_DETAILS:
      '/api/FieldVerification/GetLeadHirerDetails?companyId={companyId}&userId={userId}&mode={mode}&leadNumber={leadNumber}&vehicleNumber={vehicleNumber}',
    POST_FVR_HIRER_DETAILS:
      '/api/FieldVerification/AddFvrHirerDetail?companyId={companyId}&leadId={leadId}',
    POST_FVR_ASSET_DETAILS:
      '/api/FieldVerification/AddFvrAssetDetail?companyId={companyId}&userId={userId}&leadId={leadId}',
    GET_FVR_GUARANTOR_DETAILS:
      '/api/FieldVerification/GetFvrGuarantorDetails?companyId={companyId}&userId={userId}&leadId={leadId}&personType={personType}',
  },
};

/**
 * Constants for Severity for Toast
 */
export const FOSToastSeverity = {
  SUCCESS: 'success',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

/**
 * Keys for Search Params
 */
export const MyRequestSearchParamsKeys = {
  COMPANY_NAME: '08A2D0D7-1A1C-489D-A477-870B4CBB7E38',
  CLIENT_NUMBER: '8075a768-4b57-40b4-be21-0eb5188c33c2',
  ENG_OPP_NO: '1849C4E6-7A28-42AF-9CF7-30A7829977B0',
  REQUESTER: '251BA863-790C-492B-9149-3E52C9C0F5CE',
  STATUS: '8098a82b-9aeb-4f3b-a7cf-84f95756dca8',
  SUBMITTED_DATE: '133176ab-eed8-4492-a89a-b42d940d65f3',
};

/**
 * Config for merging the Status
 */
export const MyRequestStatusMergeConfig = {
  NO_ROLE: [
    {
      key: 'NEW_REQUEST_RETURNED_TO_REQUESTER',
      value: [1, 2],
    },
    {
      key: 'UNDER_CA_REVIEW_RETURNED_TO_CONFLICTS_ADMIN_SEARCH_IN_PROGRESS',
      value: [3, 10, 4],
    },
    {
      key: 'UNDER_BUSINESS_REVIEW_PENDING_BUSINESS_RESOLUTION',
      value: [6, 12],
    },
    {
      key: 'UNDER_LEGAL_REVIEW_PENDING_LEGAL_RESOLUTION',
      value: [5, 11],
    },
  ],
  ADDITIONAL_STATUS: [
    {
      requestStatusId: -1,
      name: 'All Active Statuses',
      displayOrder: -2,
    } as IFOSStatus,
    {
      requestStatusId: -2,
      name: 'All Auto Statuses',
      displayOrder: 0,
    } as IFOSStatus,
    {
      requestStatusId: -3,
      name: 'All Final Statuses',
      displayOrder: -1,
    } as IFOSStatus,
  ],
  ADDITIONAL_STATUS_VALUES: {
    ALL_AUTO_STATUS: '17,18',
  },
  ADDITIONAL_STATUS_REQUEST_ID: {
    ALL_AUTO_STATUS: -2,
    ALL_ACTIVE_STATUS: -1,
    ALL_FINAL_STATUS: -3,
  },
};

/**
 * Constants for Form Control Names
 */
export const FormControlNames = {
  MY_REQUEST: {
    SEARCH_COMPONENT: {
      PARAMETER: 'parameter',
      SEARCH_BY: 'searchBy',
      REQUESTER: 'requesters',
      STATUS: 'status',
      DATES: 'dates',
    },
  },
};

/**
 * my_request config keys
 */
export const ConfigKeys = {
  MY_REQUEST: {
    SEARCH_FORM: {
      COMPANY_NAME: '08A2D0D7-1A1C-489D-A477-870B4CBB7E38',
      CLIENT_NUMBER: '8075a768-4b57-40b4-be21-0eb5188c33c2',
      ENG_OPP_NO: '1849C4E6-7A28-42AF-9CF7-30A7829977B0',
      REQUESTER: '251BA863-790C-492B-9149-3E52C9C0F5CE',
      STATUS: '8098a82b-9aeb-4f3b-a7cf-84f95756dca8',
      SUBMITTED_DATE: '133176ab-eed8-4492-a89a-b42d940d65f3',
    },
    REQUEST_TABLE: {
      SUBMITTED_DATE: '15952cef-e312-43ea-b577-db522a4028ac',
      DESCRIPTION: '7e9e9874-7947-4d9a-a408-db75350562de',
      ENG_OPP_NO: 'da5d7cbe-447c-4730-974b-4c35bb7679e6',
      OFFICE: '9c84b7dd-e927-4a65-95dd-74879c13ba75',
      STATUS: 'f2a0f0c8-a514-4af4-947b-645dc3f5f83f',
      CONFLICT_TYPES: 'ca941d4c-a77c-40ef-93e2-8aa98c573dff',
    },
  },
};

/**
 * Constants for Status Type
 */
export const StatusTypes = {
  STATUS_TYPES: {
    UNDER_BUSINESS_REVIEW: 'Under Business Review',
    PENDING_BUSINESS_RESOLUTION: 'Pending Business Resolution',
    UNDER_LEGAL_REVIEW: 'Under Legal Review',
    PENDING_LEGAL_RESOLUTION: 'Pending Legal Resolution',
    CLEARED: 'Cleared',
    MANAGED: 'Managed',
    TRUE_CONFLICT: 'True Conflict',
  },
};

/**
 * Constants for Date format
 */
export const DateFormat = {
  UTC_DATE_FORMAT: {
    UTC_FORMAT: 'YYYY-MM-DDThh:mm:ss[Z]',
  },
};

/**
 * Constant for end-point domain
 */
export const FOSServiceDomain: string = '{domain}';

/**
 * Literals for Micro Services
 */
export const FOSCCMicroApiDomain = {
  REQUEST: 'api-request',
  FILE: 'api-file',
};

/**
 * Http Header Keys
 */
export const HttpHeaderKeys = {
  ACCESS_CONTROL_EXPOSE_HEADERS: 'Access-Control-Expose-Headers',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
};

/**
 * Http Header Values
 */
export const HttpHeaderValues = {
  CONTENT_DISPOSITION: 'content-disposition',
  XLSX_TYPE:
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ACCEPT_TYPE: 'application/vnd.ms-excel',
};

/**
 * Download the file name
 */
export const DownloadFileName = {
  MY_REQUEST: 'MyRequestsResult',
};

/**
 * Download File Format
 */
export const DownloadFileFormat = {
  XLSX: '.xlsx',
};

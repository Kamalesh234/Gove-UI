/**
 * Represents a MyRequest search request
 */
export interface MyRequestSearchRequest {
  parameters: string;
  searchBy: string;
  requesters: string[];
  status: string[];
  dates: Date[];
}

/**
 * Interface for My Request object from API.
 */
export interface IMyRequestApiData {
  id: string;
  requested: string;
  description: string;
  eng: string;
  office: string;
  status: string;
  conflictType: string;
}

/**
 * Interface for the view (table data) for My Request
 */
export interface IMyRequestViewData {
  id: string;
  requested: string;
  description: string;
  eng: string;
  office: string;
  status: string;
  conflictType: string;
}

/*
* Interface for My Request Page Data
* **/
export interface IFOSMyRequestData {
  requestId: number;
  submittedDate: string;
  dealName:string;
  clientName:string;
  subjectName:string;
  statusName:string;
  dealNumber: number;
  dealOffice: string;
  dealOfficeRegion: string;
  conflictTypeName:string;
  description?:string;
  [key:string]:any;
}

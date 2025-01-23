// import IFOSDropdown from "../IFOSDropdown";
import IFOSTableColumn from "../IFOSTableColumn";
import {IFOSMyRequestSearch, IFOSStatus} from "../IFOSMyRequest";

/**
 * Interface for Requester
 * Todo : Need to rename to IStoreRequesterFilter
 * */
export interface IFOSRequester{
  id: string,
  staffId: number,
  hrEmployeeId: number,
  firstName: string,
  lastName: string,
  email: string,
  isActive: boolean,
  name: string,
}

/**
 * Interface for Status
//  * */
// export interface IStoreStatus extends IFOSDropdown{
//   selected: false;
// }

/**
 * Interface for Submitted Date
 * Note - Data should be store in UTC format. While displaying, need to convert to local zone
 * */
export interface IStoreSubmittedDate{
  startDate: string;
  endDate: string;
}

/**
 * Interface for Search Params
 * */
export interface IStoreSearchParam{
  searchKey: string;
  searchText:string;
}

/*
* Interface for each table record
**/
export interface IStoreTableRecord {
  data: IFOSTableColumn[]
}

/**
 * Interface for MyRequest
 * */
export default interface IFOSStoreCcMyRequest {
  requester: IFOSRequester[];
  status: IFOSStatus[];
  submittedDate: IStoreSubmittedDate;
  searchParam: IStoreSearchParam;
  records: [IStoreTableRecord[]];
  columns:IFOSTableColumn[];
  payload:IFOSMyRequestSearch;
}



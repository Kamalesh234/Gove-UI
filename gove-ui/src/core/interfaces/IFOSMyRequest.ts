/**
 * Interface for Status
 */
export interface IFOSStatus{
  requestStatusId:number;
  displayOrder:number;
  name:string;
  finalIndicator?:boolean;
}


/**
 * Interface to keep the constant
 */
export interface IFOSStatusMergeConfig{
  key : string;
  value: IFOSStatusMerge[];
}

/**
 * Interface for status merge for keeping config
 */
export interface IFOSStatusMerge{
  value:number[];
  key:string
}

/**
 * Interface for invoking the search
 */
export interface IFOSMyRequestSearch{
  hlQueryFilters :IFOSMyRequestPayload;
}

/**
 * Payload interface for Search API
 */
export interface IFOSMyRequestPayload {
    filters: IFOSMyRequestFilter[] | null;
    sortOption?: IFOSSortOption | null;
}

/**
 * Interface for Download My Request Data
 */
export interface IFOSMyRequestDataDownload{
  searchFilters:IFOSMyRequestPayload;
  tableFilters: IFOSMyRequestPayload;
}

/*
* Payload Interface for Filters
* **/
export interface IFOSMyRequestFilter {
    key: string;
    values: string[];
}

/*
* Payload Interface for Sort
* **/
export interface IFOSSortOption {
    field: string;
    direction: string;
}



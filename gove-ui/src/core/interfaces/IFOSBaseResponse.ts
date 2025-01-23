import { IFOSErrorResponse } from "./IFOSErrorResponse";

// Interface representing the structure of the response returned by API requests
export interface IFOSBaseResponse<T> {
  // Error details if an error occurred, otherwise null
  error: IFOSErrorResponse | null;
  // Indicates if the request was successful
  isSuccessStatusCode: boolean;
  // HTTP status code of the response
  statusCode: number;
  // The actual data returned by the API, if successful
  data: T | null;
}



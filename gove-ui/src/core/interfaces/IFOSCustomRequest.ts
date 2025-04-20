import { HttpHeaders, HttpParams } from "@angular/common/http";
/**
 * Interface for custom request options.
 * Used to define the body, headers, and params for HTTP requests.
 */
export interface IFOSCustomRequest<U> {
    body?: U; // The request body of type U
    headers?: HttpHeaders; // Optional HTTP headers
    params?: HttpParams; // Optional HTTP parameters
}

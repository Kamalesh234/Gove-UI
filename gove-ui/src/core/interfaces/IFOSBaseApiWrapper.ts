import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

// Define an interface for the IFOSBaseApiWrapper
export interface IFOSBaseApiWrapper {

  // Method to perform a GET request
  // Takes an endpoint URL and optional parameters
  // Returns an Observable of type T
  get<T>(endpoint: string, params?: HttpParams): Observable<T>;

  // Method to perform a POST request
  // Takes an endpoint URL and a body of type U
  // Returns an Observable of type T
  post<T, U>(endpoint: string, body: U): Observable<T>;
  /**
   * Method to perform a PATCH request
   * @param endpoint The endpoint to which the patch request is made
   * @param body the body of type U 
   * @param params Optional HttpParams for the request
   * @returns An observable of type T for the response
   */
  patch<T, U>(endpoint: string, body: U, params?: HttpParams): Observable<T>;
  /**
   * Method to perform a DELETE request
   * @param endpoint The endpoint to which the DELETE request is made
   * @param params Optional HttpParams for the request
   * @returns An observable of type T for the response
   */
  delete<T>(endpoint: string, params?: HttpParams): Observable<T>
}

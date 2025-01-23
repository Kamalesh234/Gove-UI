import { HttpClient, HttpErrorResponse, HttpParams, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FOSErrorhandlingService } from './fos-error-handling.service';
import { LoggerService } from './logger.service';

/**
 * Base wrapper service for handling HTTP requests.
 * Provides common methods for GET, POST, DELETE, and PATCH requests.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class FOSBaseWrapperService {

  /**
   * Constructor for initializing the dependencies
   * @param http
   * @param fosErrorHandlingService
   * @param logger
   */
  constructor(
    public http: HttpClient,
    public fosErrorHandlingService: FOSErrorhandlingService,
    public logger: LoggerService
    ) { }

  /**
   * Method to perform a GET request
   * @param url The full URL for the GET request
   * @param params Optional HttpParams for the request
   * @returns An observable of type T for the response
   */
  get<T>(url: string, params?: any): Observable<any> {
    return this.http.get<any>(url, params).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => {
          return error;
        });
      })
    );
  }

  /**
   * Method to perform a POST request
   * @param url The full URL for the POST request
   * @param body The body of the POST request
   * @returns An observable of type T for the response
   */
  post<T, U>(url: string, body?: U): Observable<T> {
    return this.http.post<T>(url, body).pipe(
      catchError(error => {
        return throwError(() => {
          return error;
        });
      })
    );
  }

  /**
   * Method to perform a DELETE request
   * @param url The full URL for the DELETE request
   * @param params Optional HttpParams for the request
   * @returns An observable of type T for the response
   */
  delete<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.delete<T>(url, { params }).pipe(
      catchError(error => {
        return throwError(() => {
          new Error(error)
        });
      })
    );
  }

  /**
   * Method to perform a PATCH request
   * @param url The full URL for the PATCH request
   * @param body The body of the PATCH request
   * @param params Optional HttpParams for the request
   * @returns An observable of type T for the response
   */
  patch<T, U>(url: string, body: U, params?: HttpParams): Observable<T> {
    return this.http.patch<T>(url, body, { params }).pipe(
      catchError(error => {
        return throwError(() => {
          new Error(error)
        });
      })
    );
  }
}

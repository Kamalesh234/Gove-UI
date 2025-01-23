import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IFOSBaseResponse } from '../interfaces/IFOSBaseResponse';

@Injectable()
export class FOSErrorHandlingInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * Intercepts HTTP requests and handles errors.
   * @param request The HTTP request being intercepted.
   * @param next The next interceptor in the chain.
   * @returns An Observable of the HTTP event.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: ErrorEvent | HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Handles the HTTP error and creates an error response.
   * @param error The error event or HttpErrorResponse.
   * @returns An Observable of the HTTP event with an error response.
   */
  handleError<T>(
    error: ErrorEvent | HttpErrorResponse
  ): Observable<HttpEvent<IFOSBaseResponse<T>>> {
    // let errorMessage = this.getErrorMessage(error); // Get the appropriate error message

    // let errorResponse: IFOSBaseResponse<T> = {
    //   error: {
    //     message: errorMessage,
    //     exception: error.error || null,
    //     innerError: error.error.innerError || null
    //   },
    //   isSuccessStatusCode: false,
    //   statusCode: 0, // default status code
    //   data: null
    // };

    // if (error instanceof HttpErrorResponse) {
    //   errorResponse.statusCode = error.status;
    // } else {
    //   errorResponse.statusCode = error.error.status ?? 0;
    // }

    // // Provide a fallback value, an empty object of type T
    // const fallbackValue = {} as T;
    // errorResponse.data = fallbackValue;

    // // Create an HttpResponse with the errorResponse
    // const httpResponse: HttpResponse<IFOSBaseResponse<T>> = new HttpResponse({
    //   status: errorResponse.statusCode,
    //   body: errorResponse,
    // });

    // console.error(httpResponse);

    // Return an observable that emits the HttpResponse with the error response
    if (error instanceof HttpErrorResponse) {
      if (error.status == 401)
        return throwError(
          () =>
            new Error(
              'Unable to connect to the server. Please login and try again.'
            )
        );
      else if (error.status == 400) {
        let consolidatedErrors = '';
        let consolidatedErrorArray = [];
        if (error.error.error && error.error.error.message)
          return throwError(() => new Error(error.error.error.message));
        else if (error.error.errors) {
          let errorData = error.error.errors;
          for (const key in errorData) {
            if (Object.prototype.hasOwnProperty.call(errorData, key)) {
              const errorProp = errorData[key];
              for (const key in errorProp) {
                consolidatedErrorArray.push(errorProp[key]);
              }
            }
          }
          consolidatedErrors += consolidatedErrorArray.join('|');
        }

        return throwError(() => new Error(consolidatedErrors));
      }
    }
    return throwError(() => new Error(error.error.error.message));
  }

  /**
   * Gets the appropriate error message based on the error type.
   * @param error The error event or HttpErrorResponse.
   * @returns The error message.
   */
  private getErrorMessage(error: ErrorEvent | HttpErrorResponse): string {
    if (error instanceof HttpErrorResponse) {
      // Server-side error
      switch (error.error.statusCode) {
        case 400:
          return 'Bad Request';
        case 401:
          return 'Unauthorized';
        case 403:
          return 'Forbidden';
        case 404:
          return 'Not Found';
        case 500:
          return 'Server Error';
        default:
          return `Error Code: ${error.error.statusCode}\nMessage: ${error.error.message}`;
      }
    } else {
      // Client-side error
      return `Error: ${error.message}`;
    }
  }
}

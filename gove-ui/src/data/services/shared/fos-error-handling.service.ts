import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IFOSBaseResponse } from '../../../core/interfaces/IFOSBaseResponse';
import { ERROR_MESSAGES } from '../../../data/constants/fos-error-message';

@Injectable({
  providedIn: 'root',
})
export class FOSErrorhandlingService {
  // constructor(private translate: TranslateService) { }

  constructor() {}
  /**
   * Handles HTTP errors and returns an Observable with a typed FOSBaseResponse.
   * @param error The HTTP error response.
   * @returns An Observable with IFOSBaseResponse<T> as the value.
   */
  handleError<T>(error: HttpErrorResponse): Observable<IFOSBaseResponse<T>> {
    let errorMessage = this.getErrorMessage(error.status); // Get translated error message
    let errorResponse = {
      error: {
        message: errorMessage,
        exception: error.error,
        innerError: this.getInnerError(error.error),
      },
      isSuccessStatusCode: false,
      statusCode: error.status,
      data: null as any, // Type assertion to any
    };
    // Return an observable with the errorResponse as the value
    return of(errorResponse);
  }

  /**
   * Gets the translated error message based on the HTTP status code.
   * @param status The HTTP status code.
   * @returns The translated error message.
   */
  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.BAD_REQUEST;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
    return '';
  }

  /**
   * Extracts the inner error information recursively.
   * @param error The error object.
   * @returns The inner error information.
   */
  private getInnerError(error: any): any {
    if (error && error.innerError) {
      return {
        message: error.innerError.message,
        innerError: this.getInnerError(error.innerError),
      };
    }
    return null;
  }
}

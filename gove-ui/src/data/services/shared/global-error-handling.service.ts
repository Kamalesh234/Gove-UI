import { ErrorHandler, Injectable } from '@angular/core';
import { InvalidTokenError } from 'jwt-decode';

/**
 * Global Error Handling Service.
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlingService extends ErrorHandler {

  /**
   * Check the received error and threat it showing the correct output when needed.
   * @param error The received error.
   */
  override handleError(error: Error) {
    // console.log(error);

    if (error instanceof InvalidTokenError)
      console.log('Impossible to decode the token');

    // Custom error handling logic
    throw error;
  }
}

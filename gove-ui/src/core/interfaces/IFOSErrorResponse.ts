// Interface representing the structure of the error response for API requests
export interface IFOSErrorResponse {
    // Error message from the API
    message: string;
    // Exception details from the FOS
    exception: string;
    // Inner error details, if any
    innerError: IFOSErrorResponse | null;
  }

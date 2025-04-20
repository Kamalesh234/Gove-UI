import { Observable } from 'rxjs';
import { IFOSCustomRequest } from './IFOSCustomRequest';

/**
 * Interface for the FOSApiWrapperService.
 * Defines methods for making custom HTTP requests.
 */
export interface IFOSApiWrapper {
    /**
     * Makes a custom HTTP request with the specified method, endpoint, and optional request options.
     * @param method The HTTP method (e.g., GET, POST, PUT, DELETE, etc.).
     * @param endpoint The API endpoint URL.
     * @param requestOptions Optional request options.
     * @returns An Observable of the response data.
     */
    customRequest<T, U>(
        method: string,
        endpoint: string,
        requestOptions?: IFOSCustomRequest<U>
    ): Observable<U>;
}

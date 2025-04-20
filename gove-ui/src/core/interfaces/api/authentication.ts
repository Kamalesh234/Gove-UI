import { Params } from '@angular/router';

/**
 * Interface of AuthOptions used on login.
 */
export interface IAuthOptions {
  redirectUrl: string;
  queryParams: Params;
}

/**
 * Interface for mocking the roles information we receive until we don't have access to backend.
 */
export interface IAuthSecurityProfile {
  [type: string]: object;
}

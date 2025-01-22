import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../../data/services/shared/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  /**
   * Check conditions to allow route activation
   * @param route
   * @param state
   * @returns
   */
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    let sessionExpireDate = Number(localStorage.getItem('sessionExpireDate'));
    if (!sessionExpireDate) this.router.navigate(['/login']);
    if (sessionExpireDate) {
      const currentDate = new Date().getTime().toString();
      const currentDateWithoutMilliseconds = parseInt(
        currentDate.substring(0, currentDate.length - 3)
      );
      if (currentDateWithoutMilliseconds < sessionExpireDate) {
        return true;
      }
    }
    let accessToken = localStorage.getItem('userToken');
    let refreshToken = localStorage.getItem('refreshToken');
    const isRefreshSuccess = await this.tryRefreshingTokens(
      accessToken!,
      refreshToken!
    );
    return isRefreshSuccess;
  }

  private async tryRefreshingTokens(
    accessToken: string,
    refreshToken: string
  ): Promise<boolean> {
    if (!accessToken || !refreshToken) {
      return false;
    }
    let isRefreshSuccess: boolean;
    const refreshRes = await new Promise<any>((resolve, reject) => {
      this.userService.refreshToken(accessToken, refreshToken).subscribe({
        next: (res: any) => resolve(res),
        error: (_) => {
          reject;
          isRefreshSuccess = false;
        },
      });
    });
    localStorage.setItem('userToken', refreshRes.message.accessToken);
    localStorage.setItem('refreshToken', refreshRes.message.refreshToken);
    localStorage.setItem(
      'sessionExpireDate',
      refreshRes.message.sessionExpireDate
    );
    isRefreshSuccess = true;
    return isRefreshSuccess;
  }

  /**
   * Process authentication and redirect on route activation
   * @param route
   * @param state
   * @returns
   */
  private doCanActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // this.authService
    //   .completeAuthentication({
    //     redirectUrl: route.url.toString(),
    //     queryParams: route.queryParams,
    //   })
    //   .catch(throwError);
    return true;
  }
}

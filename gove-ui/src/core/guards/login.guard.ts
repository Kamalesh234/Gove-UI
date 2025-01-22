import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  /**
   * Check conditions to allow route activation
   * @param route
   * @param state
   * @returns
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let sessionExpireDate = Number(localStorage.getItem('sessionExpireDate'));
    if (sessionExpireDate) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}

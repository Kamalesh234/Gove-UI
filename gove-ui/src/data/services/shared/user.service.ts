import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import {
  FOSApiEndPoints,
  FOSPermissions,
  FOSRoles,
} from '../../../core/common/literals';
import { IUserAuth } from '../../../core/interfaces/user-auth';
import { UserMapper } from '../../mappers/user-mapper';
import { UtilsService } from './utils.service';
import { FOSBaseWrapperService } from './fos-basewrapper.service';
import { FOSErrorhandlingService } from './fos-error-handling.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Service provider to deal with User Service
 */
export class UserService {
  private _userSubject: BehaviorSubject<IUserAuth> =
    new BehaviorSubject<IUserAuth>(null as any);
  // user$: Observable<IUserAuth> = this.store.select((state) => state.login);

  constructor(
    private fosBaseWrapper: FOSBaseWrapperService,
    private utilService: UtilsService,
    private userMapper: UserMapper,
    public fosErrorHandler: FOSErrorhandlingService
  ) {}

  /**
   * Init the user information.
   *
   * @param user UserAuth object to init.
   *
   */
  init(user: IUserAuth) {
    this._userSubject.next(user);
  }

  /**
   * Recover the user information.
   */
  getUser(): IUserAuth {
    return this._userSubject.value;
  }

  authenticateUser(userName: string, password: string): Observable<any> {
    let endPoint: string = this.utilService.buildApiEndpoint(
      null,
      FOSApiEndPoints.USER_LOGIN_API,
      ''
    );
    if (!endPoint.trim()) {
      //Todo - Need to use Translation Service to display the translated message
      // this.hlToastService.displayToast(HLToastSeverity.ERROR,"","" );
    }

    return this.fosBaseWrapper
      .post<any, any>(endPoint, {
        userName: userName,
        password: password,
      })
      .pipe(
        catchError((error) => {
          this.fosErrorHandler.handleError(error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(accessToken: string, refreshToken: string): Observable<any> {
    let endPoint: string = this.utilService.buildApiEndpoint(
      null,
      FOSApiEndPoints.USER_REFRESH_TOKEN_API
    );
    let body = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return this.fosBaseWrapper.post<any, any>(endPoint,body).pipe(
      catchError((error) => {
        this.fosErrorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getSideBarData(userId: any): Observable<any> {
    let endPoint: string = this.utilService.buildApiEndpoint(
      null,
      FOSApiEndPoints.SIDEBAR_API.replace('{userId}', userId),
      ''
    );
    return this.fosBaseWrapper.get(endPoint).pipe(
      catchError((error) => {
        this.fosErrorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getSideBarMaster(): Observable<any> {
    const url: string = FOSApiEndPoints.NAV_MENU_LOCAL;
    return this.fosBaseWrapper.get(url);
  }
}

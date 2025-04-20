import { Injectable } from '@angular/core';
import {FOSBaseWrapperService} from "../../shared/fos-basewrapper.service";
import {UtilsService} from "../../shared/utils.service";
import { FOSErrorhandlingService } from "../../shared/fos-error-handling.service";
import {catchError, Observable, take, throwError} from "rxjs";
import { environment } from "../../../../environments/environment";
import {FOSApiEndPoints, FOSCCMicroApiDomain} from "../../../../core/common/literals";
import { IUserDesignationLookupRequest,IExistinghUserRequest,
  IUserLevelLookupRequest,IExistinghUserRequestTranslander,
  IInsertUserDetails,IUserReportingLevelLookupRequest} from '../../../../core/interfaces/app/request/IFOSModels';



@Injectable({
  providedIn: 'root'
})
export class UserManagementService {


    /**
   * Constructor to initialize the dependencies
   * @param hlBaseWrapper
   * @param utilsService
   */
 
    
    constructor(private fosBaseWrapper: FOSBaseWrapperService,
      private utilsService: UtilsService,
      public fosErrorHandler: FOSErrorhandlingService) {
}


/**
   * Method to fetch the User Level Lookup.
   * @param data
   */
fetchUserLevelLookup(data:IUserLevelLookupRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Users.USER_LEVEL_LOOKUP_API);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IUserLevelLookupRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};


/**
   * Method to fetch the User Level Lookup.
   * @param data
   */
fetchUserReportingLevelLookup(data:IUserReportingLevelLookupRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Users.USER_REPORTING_LEVEL_LOOKUP_API);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IUserReportingLevelLookupRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};


/**
   * Method to fetch the User Designation Lookup.
   * @param data
   */
fetchUserDesignationtLookup(data:IUserDesignationLookupRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Users.USER_DESIGNATION_LOOKUP_API);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IUserDesignationLookupRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};



/**
   * Method to fetch the User Existing Details.
   * @param data
   */
fetchExistingUserDetails(request:IExistinghUserRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Users.USER_EXISTING_DETAILS_API);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghUserRequest>(endPoint,request)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};

/**
   * Method to fetch the User Existing Details.
   * @param data
   */
fetchExistingUserDetailss(request:IExistinghUserRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Users.USER_EXISTING_DETAILS_API);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghUserRequest>(endPoint,request)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};


// fetchExistingUserDetailss(
//   companyId: string,
//   userId: number,
//   // leadId: number,
//   // vehicleNumber: string,
//   // leadNumber: string
// ): Observable<any> {
//   let endPoint = this.utilsService.buildApiEndpoint(
//     environment.apiBaseUrl,
//     `${FOSApiEndPoints.USER_EXISTING_DETAILS_API}?companyId=${companyId}&userId=${userId}`
//   );
//   if (endPoint.trim()) {
//     //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
//   }
//   return this.fosBaseWrapper.post(endPoint).pipe(
//     catchError((error) => {
//       this.fosErrorHandler.handleError(error);
//       return throwError(() => error);
//     })
//   );
// }

/**
   * Method to fetch the User Existing Details Translander. 
   * @param data
   */
fetchExistingUserDetailsTranlander(request:IExistinghUserRequestTranslander): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Users.USER_EXISTING_DETAILS_TRANSLANDER_API);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghUserRequestTranslander>(endPoint,request)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};



insertUserDetails(request:IInsertUserDetails): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Users.USER_INSERT_API);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IInsertUserDetails>(endPoint,request)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};

}

import { Injectable } from '@angular/core';
import {FOSBaseWrapperService} from "../../shared/fos-basewrapper.service";
import {UtilsService} from "../../shared/utils.service";
import { FOSErrorhandlingService } from "../../shared/fos-error-handling.service";
import {catchError, Observable, take, throwError} from "rxjs";
import { environment } from "../../../../environments/environment";
import {FOSApiEndPoints, FOSCCMicroApiDomain} from "../../../../core/common/literals";
import { IBranchLookupRequest,IExistinghUserRequest,
  IUserLevelLookupRequest,IExistinghUserRequestTranslander,
  IInsertUserDetails,IExistinghSMARequest,IExistinghNpahistoryRequest,IExistinghNpasummaryRequest} from '../../../../core/interfaces/app/request/IFOSModels';



@Injectable({
  providedIn: 'root'
})
export class ReportsService {


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

/**
   * Method to fetch the User Designation Lookup.
   * @param data
   */
fetchBranchLookup(data:IBranchLookupRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetBranchLookup);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IBranchLookupRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
fetchEMPcodeLookup(): Observable<any> {
  let endPoint = this.utilsService.buildApiEndpoint(
    environment.apiBaseUrl,
    FOSApiEndPoints.Reports.GetEmpCodeLookup
  );
  if (endPoint.trim()) {
    //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
  }
  return this.fosBaseWrapper.get(endPoint).pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
}
fetchNpareportdetails(data:IExistinghNpasummaryRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetNpaSummarydetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghNpasummaryRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
fetchSOAdetails(data:IExistinghNpasummaryRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetSOAdetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghNpasummaryRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
fetchNpaSummarydetails(data:IExistinghNpasummaryRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetNpaSummarydetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghNpasummaryRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};

fetchNpaHistorydetails(data:IExistinghNpahistoryRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetNpaHistorydetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghNpahistoryRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};

fetchSMATransladerdetails(data:IExistinghSMARequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetSMATransladerdetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghSMARequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
fetchCollectiondetails(data:IExistinghSMARequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetCollectiondetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghSMARequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
fetchMISdetails(data:IExistinghSMARequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetMISreportdetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghSMARequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
fetchSalesIncentivedetails(data:IExistinghNpasummaryRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetSalesIncentivedetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghNpasummaryRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
fetchCollectionIncentivedetails(data:IExistinghNpasummaryRequest): Observable<any>{
  let endPoint = this.utilsService.buildApiEndpoint(environment.apiBaseUrl,FOSApiEndPoints.Reports.GetCollectionIncentivedetails);
  if(endPoint.trim()){
  }
  return this.fosBaseWrapper
  .post<any,IExistinghNpasummaryRequest>(endPoint,data)
  .pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
}

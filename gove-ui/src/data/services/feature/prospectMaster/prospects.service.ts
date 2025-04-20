import { FOSBaseWrapperService } from '../../shared/fos-basewrapper.service';
import { UtilsService } from '../../shared/utils.service';
import {
  IBranchLocationRequest,
  ICreateProspectRequest,
  ICustomerProspectData,
  ICustomerProspectRequest,
  IFOBranchLocation,
  IFOSLookup,
} from '../../../../core/interfaces/app/request/IFOSModels';
import {
  FOSApiEndPoints,
  FOSCCMicroApiDomain,
} from '../../../../core/common/literals';
import { catchError, Observable, take, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { FOSErrorhandlingService } from '../../shared/fos-error-handling.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

/**
 * Service class for Request
 */
export class FOSProspectService {
  /**
   * Constructor to initialize the dependencies
   * @param hlBaseWrapper
   * @param utilsService
   */
  constructor(
    private fosBaseWrapper: FOSBaseWrapperService,
    private utilsService: UtilsService,
    public fosErrorHandler: FOSErrorhandlingService
  ) {}

  /**
   * Method to fetch the Prospect Lookup.
   */
  fetchProspectLookup(): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.apiBaseUrl,
      FOSApiEndPoints.PROSPECT_LOOKUP_API
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

  fetchStates(): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.STATES_LOOKUP_API
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }
    return this.fosBaseWrapper.get(endPoint).pipe(
      catchError((error) => {
        this.fosErrorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Method to fetch the Branch Location.
   * @param data
   */
  fetchBranchLocation(data: IBranchLocationRequest): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.BRANCH_LOOKUP_API
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }
    return this.fosBaseWrapper
      .post<any, IBranchLocationRequest>(endPoint, data)
      .pipe(
        catchError((error) => {
          this.fosErrorHandler.handleError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Fetch the Customer Prospect Information.
   * @param request
   */
  fetchCustomerProspect(
    request: ICustomerProspectRequest
  ): Observable<ICustomerProspectData> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.EXISTING_PROSPECT_API
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper
      .post<any, ICustomerProspectRequest>(endPoint, request)
      .pipe(
        catchError((error) => {
          this.fosErrorHandler.handleError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Create a new Customer Prospect.
   * @param request
   */
  createNewProspect(request: ICreateProspectRequest): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.CREATE_PROSPECT_API
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper
      .post<any, ICustomerProspectRequest>(endPoint, request)
      .pipe(
        catchError((error) => {
          this.fosErrorHandler.handleError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Fetch the Customer Prospect Information.
   * @param request
   */
  exportProspects(exportType: string): Observable<any> {
    let endPoint = this.utilsService
      .buildApiEndpoint(
        environment.prospectsApi,
        FOSApiEndPoints.EXPORT_PROSPECTS
      )
      .replace('{fileOutputType}', exportType);
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper
      .get(endPoint,{
        responseType: 'blob', // Important to handle binary data
        observe: 'response',
      })
      .pipe(
        catchError((error) => {
          this.fosErrorHandler.handleError(error);
          return throwError(() => error);
        })
      );
  }
}

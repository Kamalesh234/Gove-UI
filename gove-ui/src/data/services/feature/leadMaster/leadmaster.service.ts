import { FOSBaseWrapperService } from '../../shared/fos-basewrapper.service';
import { UtilsService } from '../../shared/utils.service';
import {
  ICustomerProspectData,
  ICustomerProspectRequest
} from '../../../../core/interfaces/app/request/IFOSModels';
import {
  FOSApiEndPoints,
  FOSCCMicroApiDomain,
} from '../../../../core/common/literals';
import { catchError, Observable, take, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { FOSErrorhandlingService } from '../../shared/fos-error-handling.service';
import { environment } from '../../../../environments/environment';
import {
  ILead,
  ILeadHeader,
  ILeadIndividualDetail,
  ILeadNonIndividualDetail,
  ILeadTranslanderRequest,
} from '../../../../core/interfaces/app/leads/IFOSLeadsModel';

@Injectable({
  providedIn: 'root',
})

/**
 * Service class for Request
 */
export class FOSLeadMasterService {
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
  fetchLeadStatuses(): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.Leads.GET_LEADSTATUSES
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

   /**
   * Method to fetch the Prospect Lookup.
   */
   fetchLineOfBusinesses(  companyId: number,
    userId: number): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.Leads.GET_LINEOFBUSINESSES.replace(
        '{companyId}',
        String(companyId)
      ).replace('{userId}', String(userId))
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

  /**
   * Method to fetch the Prospect Lookup.
   */
  fetchDocumentCategories(  companyId: number,
    userId: number): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.GET_DOCUMENT_CATEGORIES.replace(
        '{companyId}',
        String(companyId)
      ).replace('{userId}', String(userId))
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

   /**
   * Method to fetch the Prospect Lookup.
   */
   fetchFieldExecutives(companyId: number,
    userId: number): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.Leads.GET_FIELDEXECUTIVES.replace(
        '{companyId}',
        String(companyId)
      ).replace('{userId}', String(userId))
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

  fetchLeadGenerationLookup(
    companyId: number,
    userId: number
  ): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.Leads.GET_LEAD_GENERATION_LOOKUP.replace(
        '{companyId}',
        String(companyId)
      ).replace('{userId}', String(userId))
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
  fetchAssetLookup(companyId: number, userId: number): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      `${FOSApiEndPoints.Leads.GET_ASSETLOOKUP}?companyId=${companyId}&userId=${userId}`
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
  fetchLeadDetails(
    companyId: number,
    userId: number,
    leadId: number,
    vehicleNumber: string,
    leadNumber: string
  ): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      `${FOSApiEndPoints.Leads.GET_LEADDETAILS}?companyId=${companyId}&userId=${userId}&leadId=${leadId}&vehicleNumber=${vehicleNumber}&leadNumber=${leadNumber}`
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
   * Fetch the Customer Prospect Information.
   * @param request
   */
  fetchLeadProspect(
    request: ICustomerProspectRequest
  ): Observable<ICustomerProspectData> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.Leads.GET_PROPSPECT_DETAILS_FOR_LEAD
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
  generateLead(
    userId: number,
    companyId: number,
    locationId: number,
    request: ILeadHeader
  ): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      `${FOSApiEndPoints.Leads.CREATE_LEAD_DETAILS}?companyId=${companyId}&userId=${userId}&locationId=${locationId}`
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper.post<any, ILeadHeader>(endPoint, request).pipe(
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
  getLeadTranslanderDetails(request: ILeadTranslanderRequest): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.Leads.GET_LEADTRANSLANDERDETAILS
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper
      .post<any, ILeadTranslanderRequest>(endPoint, request)
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
  addLeadLoanDetails(request: ILead): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.Leads.CREATE_LEAD_GENERATION_HEADER
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper.post<any, ILead>(endPoint, request).pipe(
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
  addLeadGuarantors(request: ILead): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      FOSApiEndPoints.Leads.CREATE_GUARANTOR_DETAILS
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper.post<any, ILead>(endPoint, request).pipe(
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
  addLeadIndividualDetails(
    companyId: number,
    userId: number,
    leadId: number,
    request: ILeadIndividualDetail
  ): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      `${FOSApiEndPoints.Leads.CREATE_LEAD_INDIVIDUAL_RECORD}?companyId=${companyId}&userId=${userId}&leadId=${leadId}`
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper
      .post<any, ILeadIndividualDetail>(endPoint, request)
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
  addLeadNonIndividualDetails(
    userId: number,
    leadId: number,
    request: ILeadNonIndividualDetail
  ): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(
      environment.prospectsApi,
      `${FOSApiEndPoints.Leads.CREATE_LEAD_NON_INDIVIDUAL_RECORD}?userId=${userId}&leadId=${leadId}`
    );
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    return this.fosBaseWrapper
      .post<any, ILeadNonIndividualDetail>(endPoint, request)
      .pipe(
        catchError((error) => {
          this.fosErrorHandler.handleError(error);
          return throwError(() => error);
        })
      );
  }
}

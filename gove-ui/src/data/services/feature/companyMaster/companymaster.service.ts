import { Injectable } from '@angular/core';
import { FOSBaseWrapperService } from "../../shared/fos-basewrapper.service";
import { UtilsService } from "../../shared/utils.service";
import { FOSErrorhandlingService } from "../../shared/fos-error-handling.service";
import { FOSApiEndPoints, FOSCCMicroApiDomain } from "../../../../core/common/literals";
import { environment } from "../../../../environments/environment";
import { catchError, Observable, take, throwError } from "rxjs";
import { CompanyMasterFetch } from '../../../../core/interfaces/app/request/IFOSModels';


@Injectable({
  providedIn: 'root'
})
export class CompanyMaster {


  /**
    * Constructor to initialize the dependencies
    * @param hlBaseWrapper
    * @param utilsService
    */


  constructor(private fosBaseWrapper: FOSBaseWrapperService,
    private utilsService: UtilsService,
    public fosErrorHandler: FOSErrorhandlingService) {

  }


  fetchCompanyMaster(data: CompanyMasterFetch): Observable<any> {
    let endPoint = this.utilsService.buildApiEndpoint(environment.prospectsApi, FOSApiEndPoints.COMPANY_MASTER_FETCH_API);
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }
    return this.fosBaseWrapper
      .post<any, CompanyMasterFetch>(endPoint,data)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  };


}

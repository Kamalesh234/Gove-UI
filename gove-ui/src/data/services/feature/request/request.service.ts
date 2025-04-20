import { FOSBaseWrapperService } from "../../shared/fos-basewrapper.service";
import { UtilsService } from "../../shared/utils.service";
import { FOSApiEndPoints, FOSCCMicroApiDomain } from "../../../../core/common/literals";
import { take } from "rxjs";
import { Injectable } from "@angular/core";
import { IFOSInterestedPartyData, IFOSRequestBasicInfo } from "../../../../core/interfaces/app/request/IFOSModels";

@Injectable({
  providedIn: 'root'
})

/**
 * Service class for Request
 */
export class FOSRequestService {

  /**
   * Constructor to initialize the dependencies
   * @param hlBaseWrapper
   * @param utilsService
   */
  constructor(private hlBaseWrapper: FOSBaseWrapperService,
    private utilsService: UtilsService) {
  }

  /**
   * Method to fetch the request info
   * @param requestId
   */
  fetchRequestInfo(requestId: number, callback: Function): void {
    let endPoint = this.utilsService.buildApiEndpoint(FOSCCMicroApiDomain.REQUEST, FOSApiEndPoints.REQUEST_API);
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }
    endPoint = endPoint + `${requestId}`;
    this.hlBaseWrapper.get<IFOSRequestBasicInfo>(endPoint).pipe(take(1)).subscribe(data => {
      callback(data);
    });
  };


  /**
   * Fetch the Interested Parties
   * @param requestId
   * @param callback
   */
  fetchInterestedParties(requestId: number, callback: Function): void {
    let endPoint = this.utilsService.buildApiEndpoint(FOSCCMicroApiDomain.REQUEST, FOSApiEndPoints.REQUEST_INTERESTED_PARTY_API);
    if (endPoint.trim()) {
      //this.translate.instant('services.configuration'),this.translate.instant('services.errorLoading'); -- Todo - Need to check this
    }

    endPoint = endPoint.replace(":id", requestId.toString());
    this.hlBaseWrapper.get<IFOSInterestedPartyData[]>(endPoint).pipe(take(1)).subscribe(data => {
      callback(data);
    });
  };
}

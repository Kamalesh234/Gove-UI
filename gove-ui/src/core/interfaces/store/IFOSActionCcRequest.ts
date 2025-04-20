import {IBaseAction} from "./IFOSBaseActions";
import {IFOSActionConflictCheckRequest, IFOSActionConflictCheckViewReq} from "./IFOSActionConflictCheckRequest";

/*
* Action Interface for CC Request Object in the Store
* **/
export default interface IFOSActionCcRequest {
  myRequest:IActionMyRequest;
  ccRequestView:IFOSActionConflictCheckViewReq;
  ccRequestInfo:IFOSActionConflictCheckRequest;
}

/*
* Action interface for MyRequest
* **/
interface IActionMyRequest{
  setRequester: IBaseAction;
  setStatus: IBaseAction;
  setSubmittedDate: IBaseAction;
  setSearchParams:IBaseAction;
  setRecords:IBaseAction;
  clear:IBaseAction;
  setColumns:IBaseAction;
  setPayload:IBaseAction;
}

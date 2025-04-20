import {createAction, props} from "@ngrx/store";
import {FOSActionCommands} from "./fos-action-commands";
import {
  IFOSRequester,
  IStoreSearchParam,
  // IStoreStatus
  IStoreSubmittedDate
} from "../../interfaces/store/IFOSStoreCcMyRequest";
import IFOSTableColumn from "../../interfaces/IFOSTableColumn";
import {IFOSMyRequestSearch, IFOSStatus} from "../../interfaces/IFOSMyRequest";

/*
* Action for setting requester
* **/
export const actionMyRequestSetRequester = createAction(
  FOSActionCommands.ccRequest.myRequest.setRequester.type,
  props<{ requester: IFOSRequester[] }>()
);


/*
* Action for setting status
* **/
export const actionMyRequestSetStatus = createAction(
  FOSActionCommands.ccRequest.myRequest.setStatus.type,
  props<{ status: IFOSStatus[] }>()
);

/*
* Action for setting submitted date
* **/
export const actionMyRequestSetSubmittedDate = createAction(
  FOSActionCommands.ccRequest.myRequest.setSubmittedDate.type,
  props<{ submittedDate: IStoreSubmittedDate }>()
);

/*
* Action for setting Search Params
* **/
export const actionMyRequestSetSearchParams = createAction(
  FOSActionCommands.ccRequest.myRequest.setSearchParams.type,
  props<{ searchParam: IStoreSearchParam }>()
);

/*
* Action for setting Records
* **/
export const actionMyRequestSetRecords = createAction(
  FOSActionCommands.ccRequest.myRequest.setRecords.type,
  props<{ records: [IFOSTableColumn[]]}>()
);

/*
* Action for Clear
* **/
export const actionMyRequestClear = createAction(
  FOSActionCommands.ccRequest.myRequest.clear.type,
  props<{
    //status: IStoreStatus[],
    requester : IFOSRequester[]
  }>()
);

/*
* Action for Set Columns
* **/
export const actionMyRequestSetColumns = createAction(
  FOSActionCommands.ccRequest.myRequest.setColumns.type,
  props<{
    columns: IFOSTableColumn[]
  }>()
);

/**
 * Action to set the payload
 */
export const actionSetSearchPayload = createAction(
  FOSActionCommands.ccRequest.myRequest.setPayload.type,
  props<{payload: IFOSMyRequestSearch}>()
)



import {createReducer, on} from "@ngrx/store";
// import {globalState} from "../globalState";
import {
  actionMyRequestClear, actionMyRequestSetColumns,
  actionMyRequestSetRecords,
  actionMyRequestSetRequester,
  actionMyRequestSetSearchParams,
  actionMyRequestSetStatus, actionMyRequestSetSubmittedDate, actionSetSearchPayload
} from "../actions/fos-myRequest-actions";
import IFOSPageState from "../../interfaces/store/IFOSPageState";
import {state} from "@angular/animations";
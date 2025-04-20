import {IFOSActionLogIn} from "./IFOSActionLogIn";
import IFOSActionCcRequest from "./IFOSActionCcRequest";
import {IFOSActionConfig} from "./IFOSActionConfig";
import {IFOSActionConflictCheckRequest} from "./IFOSActionConflictCheckRequest";
/*
*  Interface for Actions
* */
export interface IFOSActions {
  login: IFOSActionLogIn;
  ccRequest: IFOSActionCcRequest;
  config:IFOSActionConfig;
}

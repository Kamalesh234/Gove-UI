import {IBaseAction} from "./IFOSBaseActions";

/**
 * Interface for actions related to the storing CC Info in the Data store
 */
export interface IFOSActionConflictCheckRequest{
  setBasicInfo: IBaseAction;
  setInterestedParties:IBaseAction;
  setFscgAccounts:IBaseAction;
  setQuestions:IBaseAction;
  setComment:IBaseAction;
}

/**
 * Interface for action related to storing page level info for View Request
 */
export interface IFOSActionConflictCheckViewReq{
  setPrevConflictChecks: IBaseAction;
  setSubsequentConflictChecks:IBaseAction;
  setInterestedParty:IBaseAction;
}

import {IBaseAction} from "./IFOSBaseActions";

/**
 * Actions for Config
 */
export interface IFOSActionConfig{
  myRequest: IFOSActionMyRequestConfig
  request: IFOSActionRequestConfig
  userSettings: IFOSActionUserConfig;
  interestedParty:IBaseAction;
}

/**
 * Interface for Actions for My Request Config
 */
export interface IFOSActionMyRequestConfig{
  tableDataSetting: IBaseAction;
  tableSetting: IBaseAction;
  searchSetting: IBaseAction;

}
/**
 * Interface for Actions for Request Config
 */
export interface IFOSActionRequestConfig{
  tabViewSetting:IBaseAction;
}

/**
 * Interface for User Config Actions
 */
export interface IFOSActionUserConfig{
  root: IBaseAction;
  myRequest:IFOSActionUserConfigMyRequest;
}

/**
 * Interface for actions for My Request User Config
 */
export interface IFOSActionUserConfigMyRequest{
  tableSettings: IBaseAction;
}

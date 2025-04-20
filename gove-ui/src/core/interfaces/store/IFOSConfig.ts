import { IFOSSearchFilter } from "./IFOSSearchFilter";
import IFOSTableColumn from "../IFOSTableColumn";
import { IFOSTableDataSetting } from "./IFOSTableData";
import { IFOSTabViewSetting } from "./IFOSTabView";

/**
 * Interface for FOS Config
 */
export interface IFOSConfigStore {
  myRequest: IFOSMyRequestConfig;
  request: IFOSRequestTabConfig;
  ccRequestInterestedParty:IFOSRequestInterestedPartyConfig;
}

/**
 * Interface for My Request Config
 */
export interface IFOSMyRequestConfig {
  searchSetting: IFOSSearchFilter[];
  tableSetting: IFOSTableColumn[];
  tableDataSetting: IFOSTableDataSetting;
}

/**
 * Interface for Request Config
 */
export interface IFOSRequestTabConfig {
  tabViewSetting: IFOSTabViewSetting[];
}

/**
 * Interface for User specific Config
 */
export interface IFOSUserConfig {
  userSettings: IFOSUserConfigProp
}

/**
 * Interface for properties for User Config
 */
export interface IFOSUserConfigProp {
  myRequests: IFOSUserMyReqTableConfig;
}

/**
 * Interface for My Request Table Config used for Manage Table View
 */
export interface IFOSUserMyReqTableConfig {
  tableSettings: IFOSMyRequestTableUserSetting[]
}

/**
 * Interface for Table Settings for My Request
 */
export interface IFOSMyRequestTableUserSetting extends Omit<IFOSTableColumn, 'columnName' | 'disabled' | 'sortable' | 'resizable'> {

}

/**
 * Interface for Interested Party Table Settings
 */
export interface IFOSRequestInterestedPartyConfig{
  tableSettings: IFOSTableColumn[];
  rowsPerPageOptions:number[];
  rowsPerPages:number;
  sortField:string;
  sortOrder:number
}

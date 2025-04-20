import {createAction, props} from "@ngrx/store";
import {FOSActionCommands} from "./fos-action-commands";
import IFOSTableColumn from "../../interfaces/IFOSTableColumn";
import {IFOSSearchFilter} from "../../interfaces/store/IFOSSearchFilter";
import { IFOSTableDataSetting } from "../../../core/interfaces/store/IFOSTableData";
import {IFOSMyRequestTableUserSetting, IFOSUserConfig} from "../../interfaces/store/IFOSConfig";
import { IFOSTabViewSetting } from "../../../core/interfaces/store/IFOSTabView";
import {IFOSInterestedPartyTableSettings} from "../../interfaces/app/request/IFOSModels";

/**
 * Action for storing the My Request Table Settings
 */
export const actionMyRequestTableSettings = createAction(
  FOSActionCommands.config.myRequest.tableSetting.type,
  props<{tableSetting: IFOSTableColumn[]}>()
);

/**
 * Action for storing the My Request Search Settings
 */
export const actionMyRequestSearchSettings = createAction(
  FOSActionCommands.config.myRequest.searchSetting.type,
  props<{searchSetting: IFOSSearchFilter[]}>()
);

/**
 * Action for storing the My Request Table Data Settings
 */
export const actionMyRequestTableDataSettings = createAction(
  FOSActionCommands.config.myRequest.tableDataSetting.type,
  props<{tableDataSetting: IFOSTableDataSetting}>()
);

/**
 * Action for storing the Request Table Data Settings
 */
export const actionRequestTabViewSettings = createAction(
  FOSActionCommands.config.request.tabViewSetting.type,
  props<{tabViewSetting: IFOSTabViewSetting[]}>()
);

/**
 * Action for storing user settings
 */
export const actionUserSettings = createAction(
  FOSActionCommands.config.userSettings.root.type,
  props<{userConfig: IFOSUserConfig}>()
);

/**
 * Actions for storing table settings
 */
export const actionMyRequestTableUserSettings = createAction(
  FOSActionCommands.config.userSettings.myRequest.tableSettings.type,
  props<{tableSettings: IFOSMyRequestTableUserSetting[]}>()
);

/**
 * Action to set the Interested Party Settings
 */
export const actionRequestInterestedTableSettings = createAction(
  FOSActionCommands.config.interestedParty.type,
  props<{tableSettings:IFOSInterestedPartyTableSettings}>()
)

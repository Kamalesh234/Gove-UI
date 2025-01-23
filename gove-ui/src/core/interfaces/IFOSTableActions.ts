import {FOSTableActions} from "../common/enum";
/*
* Interface for Table Actions
* **/
export interface IFOSTableActions{
  type: FOSTableActions,
  toolTip: string,
  callbackAction(data:any): any,
}

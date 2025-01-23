import {FOSFilterTypes} from "../common/enum";
//import IFOSDropdown, {IFOSSelectedItemGroup} from "./IFOSDropdown";

/*
* Interface for Column Filters
* **/
export interface IFOSColumnFilter{
  type: FOSFilterTypes;
  //model?: IFOSDropdown[];
  //groupModel?:IFOSSelectedItemGroup[];
}

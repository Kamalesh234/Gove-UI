import {IFOSTableActions} from "./IFOSTableActions";
import {IFOSColumnFilter} from "./IFOSColumnFilter";

/*
* Base Interface for Table Columns
* **/
export default interface IFOSTableColumn{
  columnName: string;
  columnKey: string;
  isHidden:boolean;
  columnOrder:number;
  disabled: boolean; // Future Use
  additionalData?: any;
  sortable: boolean;
  dataType?: string;
  formatMask?:string;
  resizable: boolean;
  filterType?: IFOSColumnFilter,
  actions?: IFOSTableActions,
  [key: string | number ]: any,
}

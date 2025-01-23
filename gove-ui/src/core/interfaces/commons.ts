/**
 * Interface for options to render a primeng dropdown
 */
export interface IPrimeNgDropDown {
  name: string;
  code: string;
}

/**
 * Interface for columns for manage-table view
 */
export interface IPrimeNgColumnsState {
  field: string;
  header: string;
  isHidden: boolean;
}

/**
 * Temp interface to be used on user roles.
 */
export interface IGenericObjectString {
  [type: string]: boolean | string
}

export interface MenuItem {
  title: string;
  url?: string;
  children?: MenuItem[];
  menuModule?:string;
}
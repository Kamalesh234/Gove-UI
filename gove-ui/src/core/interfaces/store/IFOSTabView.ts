/**
 *  Interface for Tab view setting
 */
export interface IFOSTabViewSetting {
  label: string;
  key: string;
  isDefault: boolean;
  order: number;
  routerLink: string;
  isDisable: boolean;
}

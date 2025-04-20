import { Injectable } from '@angular/core';
import {IFOSMyRequestPayload} from "../interfaces/IFOSMyRequest";
@Injectable({
  providedIn: 'root'
})
export class FOSApiValidatorServiceService {

  constructor() { }

  validateParameters(params: IFOSMyRequestPayload): boolean {

    let isInValidPaylod = false;

    // if (!params.filters[0]) {
    //   console.error('Validation Error: Parameters are missing');
    //   isInValidPaylod = true;
    // }
    // if (params.filters[0].values.length == 0 || !params.filters[0].values[0]) {
    //   console.error('Validation Error: Parameters are missing');
    //   isInValidPaylod = true;
    // }
   /* if (!params.sortOption.field && !params.sortOption.direction) {
      console.error('Validation Error: Parameters are missing');
      isInValidPaylod = true;
    } */

    return isInValidPaylod;
  }
}

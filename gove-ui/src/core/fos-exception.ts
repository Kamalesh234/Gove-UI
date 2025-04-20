import { IFOSException } from './interfaces/fos-exception';

/**
 * Class to handle FOS exception
 */
export class FOSException implements IFOSException {
  readonly number: number;
  readonly message: string;
  readonly appMessage: string;

  constructor(errNumber: number, errMessage: string, appMessage: string) {
    this.number = errNumber;
    this.message = errMessage;
    this.appMessage = appMessage;
  }
}

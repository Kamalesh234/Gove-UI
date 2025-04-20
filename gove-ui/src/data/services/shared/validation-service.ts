import {AbstractControl, ValidatorFn} from "@angular/forms";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
/**
 * Validation Service for different purpose based on the requirement
 */
export default class ValidationService {
  private static defaultDate:string = "01/01/1970";
  /**
   * Validation service for matching dates from primeNg Date picker
   * @param controlName
   */
  static validateNotSameDate(controlName:string):ValidatorFn{
    return(control:AbstractControl)=> {
        let dateControl= control.get(controlName);
        if(dateControl?.errors || !dateControl?.value){
          return null;
        }
        let date1 = new Date(dateControl?.value[0]).toLocaleDateString(),
            date2 = new Date(dateControl?.value[1]).toLocaleDateString();

        if(date1 === this.defaultDate && date2 === this.defaultDate){
          return null;
        }else if((date1 !== this.defaultDate && date2 === this.defaultDate) || (date1 === this.defaultDate && date2 !== this.defaultDate)){
            dateControl?.setErrors({errorMessage : "Both a start date and an end date are required for searching within a date range."});
            return {errorMessage : "Both a start date and an end date are required for searching within a date range."};
        }else if((date1 && date2) && (date1 === date2)){
          dateControl?.setErrors({errorMessage : "Please enter an end date greater than the start date."});
          return {errorMessage : "Please enter an end date greater than the start date."};
        }else{
          return null;
        }
    }
  }
}

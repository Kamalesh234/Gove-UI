import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'toBooleanYesNo'})
/**
 * Custom pipe for converting boolean to string
 * ToBooleanYesNo
 */
export class ToBooleanYesNoPipe implements PipeTransform {
    transform(value:boolean) {
        return value ? 'Yes' : 'No';
    }
}

import { Component } from '@angular/core';
import {LoaderService} from '../../.././../data/services/shared/loader.service';

/**
 * Component for Loading Component.
 */
@Component({
  selector: 'fos-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  /**
   * Inject the loader service into this component.
  */
  constructor(public loadingService: LoaderService) {

  }

}

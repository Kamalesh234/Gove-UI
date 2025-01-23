import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  concatMap,
  finalize,
  of,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service provider to show or hide a loader depending on the needs of the system.
 */
export class LoaderService {
  private loaderSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loaderSubject.asObservable();

  /**
   * Uses the observable as a metric to check wether to show or hide the loader.
   * @param obs$
   * @return The same observable.
   */
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.showLoader()),
      concatMap(() => obs$),
      finalize(() => this.hideLoader())
    );
  }

  /**
   * Show the loader
   */
  showLoader() {
    this.loaderSubject.next(true);
  }

  /**
   * Hide the loader
   */
  hideLoader() {
    this.loaderSubject.next(false);
  }
}

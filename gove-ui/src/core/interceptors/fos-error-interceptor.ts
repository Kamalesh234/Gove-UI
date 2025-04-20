import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError, timer } from 'rxjs';
import { GlobalErrorHandlingService } from '../../data/services/shared/global-error-handling.service';
import { IFOSBaseResponse } from '../interfaces/IFOSBaseResponse';

@Injectable()
export class FOSErrorInterceptor implements HttpInterceptor {
  constructor(private globalErrorHandlingService: GlobalErrorHandlingService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry({
        count: 1,
        delay: (_, retryCount) => timer(retryCount * 1000),
      }),
      catchError((error: HttpErrorResponse) => {
        this.globalErrorHandlingService.handleError(error);
        return throwError(() => error);
      })
    )
  }
}

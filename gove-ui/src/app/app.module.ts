import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { MessageService } from '@angular/material/api';
import { throwError } from 'rxjs';
import { FOSRequestInterceptor } from '../core/interceptors/fos-request-interceptor';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
// import { DesignerPageModule } from './designer-page/designer-page.module';
// import { LayoutModule } from './shared/layout/layout.module';
// import { RedirectModule } from './shared/redirect/redirect.module';
import { SharedModule } from './shared/shared.module';
import { FOSErrorInterceptor } from '../core/interceptors/fos-error-interceptor';
import { FOSErrorHandlingInterceptor } from '../core/interceptors/fos-errorhandler-interceptor';
import { StoreModule } from '@ngrx/store';
import { GlobalErrorHandlingService } from '../data/services/shared/global-error-handling.service';
import { ToastrModule } from 'ngx-toastr';
// import { HLTabViewModule } from './shared/tab-view/tab-view.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    DashboardModule,
    MatIconModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FOSErrorHandlingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FOSRequestInterceptor,
      multi: true,
    },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: appInitializer,
    //   multi: true,
    //   deps: [ConfigService],
    // },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlingService,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: FOSErrorInterceptor,
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
})

// export function HTTPLoaderFactory(http: HttpClient): TranslateHttpLoader {
//   return new TranslateHttpLoader(http, 'core/assets/i18n/', '.json');
// }
export class AppModule {}

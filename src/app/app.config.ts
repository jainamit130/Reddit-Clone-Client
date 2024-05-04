import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { noopInterceptorProvider } from './providers/noopInterceptorProvider';
import { TruncateHtmlTextPipe } from './transform/truncate-html-text.pipe';
import { routeReuseStrategyProvider } from './providers/routeReuseStrategyProvider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(NgxWebstorageModule.forRoot()),
    provideAnimations(),
    importProvidersFrom(ToastrModule.forRoot()),
    noopInterceptorProvider,
    TruncateHtmlTextPipe,
    routeReuseStrategyProvider
  ]
};

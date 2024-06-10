import { ApplicationConfig, Injectable, importProvidersFrom } from '@angular/core';
import { RouterModule, provideRouter, withRouterConfig } from '@angular/router';
// import * as Hammer from 'hammerjs';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { noopInterceptorProvider } from './providers/noopInterceptorProvider';
import { TruncateHtmlTextPipe } from './pipe/transform/truncate-html-text.pipe';
import { routeReuseStrategyProvider } from './providers/routeReuseStrategyProvider';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';

// @Injectable()
// export class HammerConfig extends HammerGestureConfig {
//   override overrides = <any> {
//     swipe: { direction: Hammer.DIRECTION_ALL },
//   };
// }

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(RouterModule.forRoot(routes, {useHash: true})),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(NgxWebstorageModule.forRoot()),
    provideAnimations(),
    importProvidersFrom(ToastrModule.forRoot()),
    // { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
    // importProvidersFrom(HammerModule),
    noopInterceptorProvider,
    TruncateHtmlTextPipe,
    TimeAgoPipe,
    routeReuseStrategyProvider
  ]
};

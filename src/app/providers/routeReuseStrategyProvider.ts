import { Provider } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../customRouteReuseStrategy';

export const routeReuseStrategyProvider: Provider =
{
  provide: RouteReuseStrategy,
  useClass: CustomRouteReuseStrategy
};
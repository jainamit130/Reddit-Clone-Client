import { Injectable, Provider } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

@Injectable({
  providedIn:'root'
})

export class CustomRouteReuseStrategy extends RouteReuseStrategy {
  public shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {}
  public shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
  public shouldReuseRoute(): boolean {
    return false;
  }
}
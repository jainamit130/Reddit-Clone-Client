import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingComponentSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();
  loadingComponent$ = this.loadingComponentSubject.asObservable();

  constructor() { }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  setLoadingComponent(loading: boolean) {
    this.loadingComponentSubject.next(loading);
  }
}

import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Output, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { Subscription, filter, fromEvent } from 'rxjs';

@Directive({
  selector: '[appDetectOutsideClick]',
  standalone: true
})
export class DetectOutsideClickDirective implements AfterViewInit,OnDestroy{
  @Output() clickOutside = new EventEmitter<void>();

  documentSubscription: Subscription | undefined; 
  constructor(private element:ElementRef, @Inject(DOCUMENT) private document: Document) {

  }

  ngAfterViewInit(): void {
      this.documentSubscription = fromEvent(this.document,'click').pipe(filter((event) => {
        return !this.isInside(event.target as HTMLElement)
      })
    ).subscribe(() => {
      this.clickOutside.emit();
    });
  }

  ngOnDestroy(): void {
      this.documentSubscription?.unsubscribe();
  }

  isInside(elementToCheck: HTMLElement) {
    return (
      elementToCheck===this.element.nativeElement ||
      this.element.nativeElement.contains(elementToCheck)
    );
  }

  
}



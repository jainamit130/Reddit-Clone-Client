import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appSwipe]',
  standalone: true
})
export class SwipeDirective {
  @Output() swipedLeft = new EventEmitter<void>();
  @Output() swipedRight = new EventEmitter<void>();

  @HostListener('swipeleft', ['$event']) onSwipeLeft(event: any) {
    this.swipedLeft.emit();
  }

  @HostListener('swiperight', ['$event']) onSwipeRight(event: any) {
    this.swipedRight.emit();
  }
}
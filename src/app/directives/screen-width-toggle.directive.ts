import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScreenWidthToggle]',
  standalone: true
})
export class ScreenWidthToggleDirective implements OnInit, OnDestroy {
  @Output() activateToggle = new EventEmitter<boolean>();
  private mediaQueryList!: MediaQueryList;
  @Input() threshold: number = 1300;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.mediaQueryList = window.matchMedia(`(max-width: ${this.threshold}px)`);
    this.mediaQueryList.addEventListener('change', this.checkWidth);
    this.checkWidth(this.mediaQueryList);
  }

  ngOnDestroy(): void {
    this.mediaQueryList.removeEventListener('change', this.checkWidth);
  }

  private checkWidth = (e: MediaQueryListEvent | MediaQueryList): void => {
    if (e.matches) {
      this.activateToggle.emit(true);
    } else {
      this.activateToggle.emit(false);
    }
  };
}
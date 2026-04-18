import { AfterViewInit, Directive, ElementRef } from '@angular/core';

// Postavlja fokus na element čim se prikaže (npr. polje pretrage).
@Directive({ selector: '[appAutoFocus]' })
export class AutoFocusDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // setTimeout da fokus sačeka da se view iscrta.
    setTimeout(() => this.el.nativeElement.focus());
  }
}

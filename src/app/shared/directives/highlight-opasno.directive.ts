import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

import { KlasaOpasnosti } from '../../core/models';

// Boji element ako reagens spada u opasnu klasu (zapaljivo/korozivno/toksično).
@Directive({ selector: '[appHighlightOpasno]' })
export class HighlightOpasnoDirective implements OnChanges {
  @Input('appHighlightOpasno') klasa?: KlasaOpasnosti;

  private opasne: KlasaOpasnosti[] = ['zapaljivo', 'korozivno', 'toksično'];

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnChanges(): void {
    const jeOpasno = !!this.klasa && this.opasne.includes(this.klasa);
    if (jeOpasno) {
      this.renderer.setStyle(this.el.nativeElement, 'borderLeft', '4px solid #c62828');
      this.renderer.setStyle(this.el.nativeElement, 'background', '#fff5f5');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'borderLeft');
      this.renderer.removeStyle(this.el.nativeElement, 'background');
    }
  }
}

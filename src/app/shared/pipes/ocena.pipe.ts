import { Pipe, PipeTransform } from '@angular/core';

// Pretvara ocenu/status ('ISPRAVAN', 'neispravan'...) u čitljiv label.
@Pipe({ name: 'ocena' })
export class OcenaPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '—';
    }
    return value.toLowerCase() === 'ispravan' ? 'Ispravan' : 'Neispravan';
  }
}

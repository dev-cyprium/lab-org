import { Pipe, PipeTransform } from '@angular/core';

const EKSPONENTI: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

// Broj kolonija u naučni zapis, npr 120000 -> "1.2 × 10⁵ CFU/g".
@Pipe({ name: 'cfu' })
export class CfuPipe implements PipeTransform {
  transform(value: number | string | null | undefined, jedinica = 'CFU/g'): string {
    if (value === null || value === undefined) {
      return '—';
    }
    // Tekstualna vrednost (npr "odsutna") se prikazuje kako jeste.
    if (typeof value === 'string') {
      return value;
    }
    if (isNaN(value)) {
      return '—';
    }
    if (value === 0) {
      return `0 ${jedinica}`;
    }
    // Male vrednosti ostavljamo kako jesu, veće prevodimo u 10^n zapis.
    if (value < 1000) {
      return `${value} ${jedinica}`;
    }

    const eksponent = Math.floor(Math.log10(value));
    const mantisa = value / Math.pow(10, eksponent);
    const zaokruzena = Math.round(mantisa * 10) / 10;
    const gornji = String(eksponent)
      .split('')
      .map((c) => EKSPONENTI[c] ?? c)
      .join('');

    return `${zaokruzena} × 10${gornji} ${jedinica}`;
  }
}

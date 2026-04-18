import { Pipe, PipeTransform } from '@angular/core';

// Datum isteka -> "ističe za N dana" / "ističe danas" / "istekao pre N dana".
@Pipe({ name: 'istek' })
export class IstekPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '—';
    }
    const istek = value instanceof Date ? value : new Date(value);
    if (isNaN(istek.getTime())) {
      return '—';
    }

    const danas = new Date();
    // Poredimo samo datume, bez sati.
    danas.setHours(0, 0, 0, 0);
    istek.setHours(0, 0, 0, 0);

    const razlika = Math.round((istek.getTime() - danas.getTime()) / 86400000);

    if (razlika === 0) {
      return 'ističe danas';
    }
    if (razlika > 0) {
      return `ističe za ${razlika} ${razlika === 1 ? 'dan' : 'dana'}`;
    }
    const proslo = Math.abs(razlika);
    return `istekao pre ${proslo} ${proslo === 1 ? 'dan' : 'dana'}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

// ISO datum -> domaći format dd.MM.yyyy.
@Pipe({ name: 'datumSr' })
export class DatumSrPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '—';
    }
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) {
      return '—';
    }
    const dan = String(d.getDate()).padStart(2, '0');
    const mesec = String(d.getMonth() + 1).padStart(2, '0');
    return `${dan}.${mesec}.${d.getFullYear()}.`;
  }
}

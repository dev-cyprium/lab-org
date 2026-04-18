import { Pipe, PipeTransform } from '@angular/core';

// Klasa opasnosti -> label + Material ikonica (za prikaz uz reagense).
@Pipe({ name: 'klasaOpasnosti' })
export class KlasaOpasnostiPipe implements PipeTransform {
  private mapa: Record<string, { label: string; ikonica: string }> = {
    zapaljivo: { label: 'Zapaljivo', ikonica: 'local_fire_department' },
    korozivno: { label: 'Korozivno', ikonica: 'science' },
    'toksično': { label: 'Toksično', ikonica: 'dangerous' },
    'nadražujuće': { label: 'Nadražujuće', ikonica: 'warning' },
    'bez oznake': { label: 'Bez oznake', ikonica: 'check_circle' },
  };

  transform(value: string | null | undefined, deo: 'label' | 'ikonica' = 'label'): string {
    if (!value || !this.mapa[value]) {
      return deo === 'ikonica' ? 'help_outline' : '—';
    }
    return this.mapa[value][deo];
  }
}

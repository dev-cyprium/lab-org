import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Laboratorija } from '../models';
import { JsonKolekcijaServis } from './json-kolekcija.servis';

@Injectable({ providedIn: 'root' })
export class LaboratorijeService extends JsonKolekcijaServis<Laboratorija> {
  protected putanja = 'assets/data/laboratorije.json';

  constructor(http: HttpClient) {
    super(http);
  }
}

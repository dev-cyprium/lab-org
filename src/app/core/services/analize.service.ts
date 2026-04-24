import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Analiza } from '../models';
import { JsonKolekcijaServis } from './json-kolekcija.servis';

@Injectable({ providedIn: 'root' })
export class AnalizeService extends JsonKolekcijaServis<Analiza> {
  protected putanja = 'assets/data/analize.json';

  constructor(http: HttpClient) {
    super(http);
  }
}

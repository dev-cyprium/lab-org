import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Zaposleni } from '../models';
import { JsonKolekcijaServis } from './json-kolekcija.servis';

@Injectable({ providedIn: 'root' })
export class ZaposleniService extends JsonKolekcijaServis<Zaposleni> {
  protected putanja = 'assets/data/zaposleni.json';

  constructor(http: HttpClient) {
    super(http);
  }
}

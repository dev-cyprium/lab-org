import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Zasejavanje } from '../models';
import { JsonKolekcijaServis } from './json-kolekcija.servis';

@Injectable({ providedIn: 'root' })
export class ZasejavanjaService extends JsonKolekcijaServis<Zasejavanje> {
  protected putanja = 'assets/data/zasejavanja.json';

  constructor(http: HttpClient) {
    super(http);
  }
}

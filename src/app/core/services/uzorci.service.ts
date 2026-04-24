import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Uzorak } from '../models';
import { JsonKolekcijaServis } from './json-kolekcija.servis';

@Injectable({ providedIn: 'root' })
export class UzorciService extends JsonKolekcijaServis<Uzorak> {
  protected putanja = 'assets/data/uzorci.json';

  constructor(http: HttpClient) {
    super(http);
  }
}

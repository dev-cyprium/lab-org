import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Podloga } from '../models';
import { JsonKolekcijaServis } from './json-kolekcija.servis';

@Injectable({ providedIn: 'root' })
export class PodlogeService extends JsonKolekcijaServis<Podloga> {
  protected putanja = 'assets/data/podloge.json';

  constructor(http: HttpClient) {
    super(http);
  }
}

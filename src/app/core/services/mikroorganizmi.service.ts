import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Mikroorganizam } from '../models';

// Za sada čita iz lokalnog JSON-a (predispitne). U Fazi 3 se izvor menja na Firestore,
// a komponente ostaju iste jer zavise samo od ovog servisa.
@Injectable({ providedIn: 'root' })
export class MikroorganizmiService {
  private readonly putanja = 'assets/data/mikroorganizmi.json';

  constructor(private http: HttpClient) {}

  ucitajSve(): Observable<Mikroorganizam[]> {
    return this.http.get<Mikroorganizam[]>(this.putanja);
  }

  ucitajJedan(id: string): Observable<Mikroorganizam | undefined> {
    return this.ucitajSve().pipe(map((lista) => lista.find((m) => m.id === id)));
  }
}

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Zajednička osnova za servise koji čitaju kolekciju iz JSON-a (faza predispitne).
// U Fazi 3 se ova osnova menja Firestore verzijom, a konkretni servisi ostaju isti.
export abstract class JsonKolekcijaServis<T extends { id: string }> {
  protected abstract putanja: string;

  constructor(protected http: HttpClient) {}

  ucitajSve(): Observable<T[]> {
    return this.http.get<T[]>(this.putanja);
  }

  ucitajJedan(id: string): Observable<T | undefined> {
    return this.ucitajSve().pipe(map((lista) => lista.find((x) => x.id === id)));
  }
}

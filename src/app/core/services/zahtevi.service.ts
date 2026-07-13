import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ZahtevZaPristup, clanstvoId } from '../models';

// Zahtevi za pristup firmi (na čekanju). Odobreni/odbijeni se brišu.
@Injectable({ providedIn: 'root' })
export class ZahteviService {
  constructor(private firestore: Firestore) {}

  // Deterministički id (`kompanijaId__uid`) — jedan aktivan zahtev po firmi.
  posalji(zahtev: Omit<ZahtevZaPristup, 'id'>): Promise<void> {
    const id = clanstvoId(zahtev.kompanijaId, zahtev.uid);
    return setDoc(doc(this.firestore, 'zahtevi', id), zahtev);
  }

  moji(uid: string): Observable<ZahtevZaPristup[]> {
    const ref = query(collection(this.firestore, 'zahtevi'), where('uid', '==', uid));
    return (collectionData(ref, { idField: 'id' }) as Observable<ZahtevZaPristup[]>).pipe(
      catchError(() => of([] as ZahtevZaPristup[]))
    );
  }

  // Zahtevi za date firme (za administratore). Firestore `in` podržava do 30 vrednosti.
  zaFirme(kompanijeIds: string[]): Observable<ZahtevZaPristup[]> {
    if (!kompanijeIds.length) return of([]);
    const ref = query(
      collection(this.firestore, 'zahtevi'),
      where('kompanijaId', 'in', kompanijeIds.slice(0, 30))
    );
    return (collectionData(ref, { idField: 'id' }) as Observable<ZahtevZaPristup[]>).pipe(
      catchError(() => of([] as ZahtevZaPristup[]))
    );
  }

  obrisi(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'zahtevi', id));
  }
}

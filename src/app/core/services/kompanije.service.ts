import { Injectable } from '@angular/core';
import { Firestore, doc, docData, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Kompanija, KompanijaKod } from '../models';

// Firme se NE listaju (privatnost). Čita se samo pojedinačna firma po id-u (za članove)
// ili se kod razrešava u firmu (get po tačnom kodu).
@Injectable({ providedIn: 'root' })
export class KompanijeService {
  constructor(private firestore: Firestore) {}

  // Jedna firma po id-u — rules dozvoljavaju samo članovima.
  ucitaj(id: string): Observable<Kompanija | null> {
    return (
      docData(doc(this.firestore, 'kompanije', id), { idField: 'id' }) as Observable<
        Kompanija | undefined
      >
    ).pipe(
      map((k) => k ?? null),
      catchError(() => of(null))
    );
  }

  // Kod -> firma. get po id-u (kodu), pa se firme ne mogu izlistati ni pretražiti.
  async razresiKod(kod: string): Promise<KompanijaKod | null> {
    const snap = await getDoc(doc(this.firestore, 'kompanije_kodovi', kod));
    return snap.exists() ? (snap.data() as KompanijaKod) : null;
  }

  async postojiKod(kod: string): Promise<boolean> {
    const snap = await getDoc(doc(this.firestore, 'kompanije_kodovi', kod));
    return snap.exists();
  }

  async upisiKod(kod: string, podaci: KompanijaKod): Promise<void> {
    await setDoc(doc(this.firestore, 'kompanije_kodovi', kod), podaci);
  }
}

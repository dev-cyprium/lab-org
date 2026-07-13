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

import { ClanstvoDoc, Uloga, clanstvoId } from '../models';

// Kolekcija `clanstva` je izvor istine o pripadnosti firmama (kontrolišu je rules).
@Injectable({ providedIn: 'root' })
export class ClanstvaService {
  constructor(private firestore: Firestore) {}

  // Sva članstva jednog korisnika (za tenant switcher i izvedene firme).
  zaKorisnika(uid: string): Observable<ClanstvoDoc[]> {
    const ref = query(collection(this.firestore, 'clanstva'), where('uid', '==', uid));
    return (collectionData(ref, { idField: 'id' }) as Observable<ClanstvoDoc[]>).pipe(
      catchError(() => of([] as ClanstvoDoc[]))
    );
  }

  async dodeli(kompanijaId: string, uid: string, uloga: Uloga): Promise<void> {
    await setDoc(doc(this.firestore, 'clanstva', clanstvoId(kompanijaId, uid)), {
      kompanijaId,
      uid,
      uloga,
    });
  }

  async ukloni(kompanijaId: string, uid: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'clanstva', clanstvoId(kompanijaId, uid)));
  }
}

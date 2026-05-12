import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Kompanija } from '../models';

// Čita listu kompanija (za izbor pri registraciji).
@Injectable({ providedIn: 'root' })
export class KompanijeService {
  constructor(private firestore: Firestore) {}

  ucitajSve(): Observable<Kompanija[]> {
    const ref = collection(this.firestore, 'kompanije');
    return collectionData(ref, { idField: 'id' }) as Observable<Kompanija[]>;
  }
}

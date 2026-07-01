import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

// Generička CRUD osnova nad Firestore-om, filtrirana po kompaniji (tenant).
// Čita se preko collectionData/docData (rade u Angular zone) + take(1) da forkJoin u
// komponentama i dalje "završi". Konkretni servisi samo zadaju ime kolekcije (`putanja`).
export abstract class FirestoreCrudServis<T extends { id: string; kompanijaId: string }> {
  protected abstract putanja: string;

  constructor(protected firestore: Firestore, protected auth: AuthService) {}

  ucitajSve(): Observable<T[]> {
    return this.auth.aktivnaKompanijaId$().pipe(
      filter((id): id is string => !!id),
      take(1),
      switchMap((kompanijaId) => {
        const ref = query(
          collection(this.firestore, this.putanja),
          where('kompanijaId', '==', kompanijaId)
        );
        return (collectionData(ref, { idField: 'id' }) as Observable<T[]>).pipe(take(1));
      }),
      // Da greška (npr. odbijeno pravilima) ne ostavi spinner da se vrti unedogled.
      catchError((greska) => {
        console.error(`Greška pri učitavanju "${this.putanja}":`, greska);
        return of([] as T[]);
      })
    );
  }

  ucitajJedan(id: string): Observable<T | undefined> {
    return (
      docData(doc(this.firestore, this.putanja, id), { idField: 'id' }) as Observable<T | undefined>
    ).pipe(
      take(1),
      catchError((greska) => {
        console.error(`Greška pri učitavanju "${this.putanja}/${id}":`, greska);
        return of(undefined);
      })
    );
  }

  // kompanijaId se uvek postavlja iz aktivne kompanije — forma ga ne šalje.
  async dodaj(entitet: Omit<T, 'id' | 'kompanijaId'>): Promise<string> {
    const ref = await addDoc(collection(this.firestore, this.putanja), {
      ...entitet,
      kompanijaId: this.auth.kompanijaId,
    });
    return ref.id;
  }

  async izmeni(id: string, izmene: Partial<T>): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(doc(this.firestore, this.putanja, id), izmene as { [k: string]: any });
  }

  async obrisi(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, this.putanja, id));
  }
}

import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, shareReplay } from 'rxjs/operators';

import { Korisnik, Kompanija } from '../models';

// Podaci sa forme za registraciju.
export interface RegistracijaPodaci {
  email: string;
  lozinka: string;
  ime: string;
  nacin: 'nova' | 'postojeca'; // nova kompanija ili pridruživanje postojećoj
  // za novu kompaniju:
  nazivKompanije?: string;
  pib?: string;
  adresa?: string;
  kontakt?: string;
  // za pridruživanje:
  kompanijaId?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Profil prijavljenog korisnika (null ako niko nije prijavljen).
  korisnik$: Observable<Korisnik | null>;
  // Kompanija (tenant) kojoj korisnik pripada.
  aktivnaKompanija$: Observable<Kompanija | null>;

  // Sinhrona kopija za servise koji grade upite (kompanijaId).
  private trenutni = new BehaviorSubject<Korisnik | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    this.korisnik$ = authState(this.auth).pipe(
      switchMap((user) =>
        user ? this.ucitajProfil(user.uid) : of(null)
      ),
      shareReplay(1)
    );

    this.aktivnaKompanija$ = this.korisnik$.pipe(
      switchMap((k) => (k ? this.ucitajKompaniju(k.kompanijaId) : of(null))),
      shareReplay(1)
    );

    this.korisnik$.subscribe((k) => this.trenutni.next(k));
  }

  get kompanijaId(): string | null {
    return this.trenutni.value?.kompanijaId ?? null;
  }

  get jeAdmin(): boolean {
    return this.trenutni.value?.uloga === 'admin';
  }

  jePrijavljen$(): Observable<boolean> {
    return authState(this.auth).pipe(map((u) => !!u));
  }

  async prijava(email: string, lozinka: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, lozinka);
  }

  async odjava(): Promise<void> {
    await signOut(this.auth);
  }

  async registruj(p: RegistracijaPodaci): Promise<void> {
    const kredencijal = await createUserWithEmailAndPassword(this.auth, p.email, p.lozinka);
    const uid = kredencijal.user.uid;

    let kompanijaId = p.kompanijaId ?? '';
    let uloga: Korisnik['uloga'] = 'laborant';

    // Nova firma → kreira se Kompanija dokument, a korisnik postaje admin.
    if (p.nacin === 'nova') {
      const ref = await addDoc(collection(this.firestore, 'kompanije'), {
        naziv: p.nazivKompanije,
        pib: p.pib ?? '',
        adresa: p.adresa ?? '',
        kontakt: p.kontakt ?? '',
        datumRegistracije: new Date().toISOString(),
        aktivan: true,
      });
      kompanijaId = ref.id;
      uloga = 'admin';
    }

    const korisnik: Korisnik = { uid, email: p.email, ime: p.ime, kompanijaId, uloga };
    await setDoc(doc(this.firestore, 'korisnici', uid), korisnik);
  }

  private ucitajProfil(uid: string): Observable<Korisnik | null> {
    return from(getDoc(doc(this.firestore, 'korisnici', uid))).pipe(
      map((snap) => (snap.exists() ? (snap.data() as Korisnik) : null))
    );
  }

  private ucitajKompaniju(id: string): Observable<Kompanija | null> {
    return from(getDoc(doc(this.firestore, 'kompanije', id))).pipe(
      map((snap) => (snap.exists() ? ({ id: snap.id, ...snap.data() } as Kompanija) : null))
    );
  }
}

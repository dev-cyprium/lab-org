import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  docData,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, shareReplay } from 'rxjs/operators';

import { Korisnik, Kompanija, Clanstvo, Uloga } from '../models';
import { KompanijeService } from './kompanije.service';

// Podaci sa forme za registraciju.
export interface RegistracijaPodaci {
  email: string;
  lozinka: string;
  ime: string;
  nacin: 'nova' | 'postojeca';
  nazivKompanije?: string;
  pib?: string;
  adresa?: string;
  kontakt?: string;
  kompanijaId?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  korisnik$: Observable<Korisnik | null>;
  aktivnaKompanija$: Observable<Kompanija | null>;
  // Sve firme kojima korisnik pripada (za prebacivanje u navbaru).
  mojeKompanije$: Observable<Kompanija[]>;

  private trenutni = new BehaviorSubject<Korisnik | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private kompanijeServis: KompanijeService
  ) {
    this.korisnik$ = authState(this.auth).pipe(
      switchMap((user) =>
        user
          ? (docData(doc(this.firestore, 'korisnici', user.uid)) as Observable<Korisnik | undefined>).pipe(
              map((k) => k ?? null)
            )
          : of(null)
      ),
      shareReplay(1)
    );

    this.aktivnaKompanija$ = this.korisnik$.pipe(
      switchMap((k) => {
        const id = AuthService.aktivnaId(k);
        return id
          ? (
              docData(doc(this.firestore, 'kompanije', id), { idField: 'id' }) as Observable<
                Kompanija | undefined
              >
            ).pipe(map((c) => c ?? null))
          : of(null);
      }),
      shareReplay(1)
    );

    this.mojeKompanije$ = combineLatest([this.korisnik$, this.kompanijeServis.ucitajSve()]).pipe(
      map(([k, sve]) => {
        const ids = AuthService.kompanijeIdsOd(k);
        return sve.filter((c) => ids.includes(c.id));
      }),
      shareReplay(1)
    );

    this.korisnik$.subscribe((k) => this.trenutni.next(k));
  }

  // ————— pomoćne (rade i sa starim i sa novim formatom profila) —————

  private static aktivnaId(k: Korisnik | null): string | null {
    if (!k) return null;
    return k.aktivnaKompanijaId || k.kompanijaId || k.clanstva?.[0]?.kompanijaId || null;
  }

  private static clanstvaOd(k: Korisnik | null): Clanstvo[] {
    if (!k) return [];
    if (k.clanstva?.length) return k.clanstva;
    if (k.kompanijaId) return [{ kompanijaId: k.kompanijaId, uloga: k.uloga ?? 'laborant' }];
    return [];
  }

  private static kompanijeIdsOd(k: Korisnik | null): string[] {
    return AuthService.clanstvaOd(k).map((c) => c.kompanijaId);
  }

  get kompanijaId(): string | null {
    return AuthService.aktivnaId(this.trenutni.value);
  }

  get jeAdmin(): boolean {
    const k = this.trenutni.value;
    const akt = AuthService.aktivnaId(k);
    return AuthService.clanstvaOd(k).find((c) => c.kompanijaId === akt)?.uloga === 'admin';
  }

  get mojiKompanijeIds(): string[] {
    return AuthService.kompanijeIdsOd(this.trenutni.value);
  }

  get googleIme(): string | null {
    return this.auth.currentUser?.displayName ?? null;
  }

  get imaAuthNalog(): boolean {
    return !!this.auth.currentUser;
  }

  jePrijavljen$(): Observable<boolean> {
    return authState(this.auth).pipe(map((u) => !!u));
  }

  aktivnaKompanijaId$(): Observable<string | null> {
    return this.korisnik$.pipe(map((k) => AuthService.aktivnaId(k)));
  }

  async prijava(email: string, lozinka: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, lozinka);
  }

  async prijavaGoogle(): Promise<boolean> {
    const kredencijal = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const snap = await getDoc(doc(this.firestore, 'korisnici', kredencijal.user.uid));
    return snap.exists();
  }

  async odjava(): Promise<void> {
    await signOut(this.auth);
  }

  async registruj(p: RegistracijaPodaci): Promise<void> {
    const kredencijal = await createUserWithEmailAndPassword(this.auth, p.email, p.lozinka);
    await this.napraviProfil(kredencijal.user.uid, p.email, p.ime, p);
  }

  async dovrsiGoogleProfil(p: RegistracijaPodaci): Promise<void> {
    const u = this.auth.currentUser;
    if (!u) {
      throw new Error('Nema aktivnog Google naloga.');
    }
    await this.napraviProfil(u.uid, u.email ?? '', u.displayName ?? p.ime, p);
  }

  // ————— prebacivanje / kreiranje / pridruživanje firmama —————

  async promeniKompaniju(kompanijaId: string): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    await updateDoc(doc(this.firestore, 'korisnici', uid), { aktivnaKompanijaId: kompanijaId });
  }

  // Napravi novu firmu, postani njen admin i pređi na nju.
  async napraviKompaniju(podaci: {
    naziv: string;
    pib?: string;
    adresa?: string;
    kontakt?: string;
  }): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    const ref = await addDoc(collection(this.firestore, 'kompanije'), {
      naziv: podaci.naziv,
      pib: podaci.pib ?? '',
      adresa: podaci.adresa ?? '',
      kontakt: podaci.kontakt ?? '',
      datumRegistracije: new Date().toISOString(),
      aktivan: true,
    });
    await this.dodajClanstvo(ref.id, 'admin');
  }

  // Pridruži se postojećoj firmi (kao laborant).
  async pridruziSe(kompanijaId: string): Promise<void> {
    await this.dodajClanstvo(kompanijaId, 'laborant');
  }

  private async dodajClanstvo(kompanijaId: string, uloga: Uloga): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    const k = this.trenutni.value;
    const clanstva = AuthService.clanstvaOd(k);
    if (!clanstva.some((c) => c.kompanijaId === kompanijaId)) {
      clanstva.push({ kompanijaId, uloga });
    }
    await updateDoc(doc(this.firestore, 'korisnici', uid), {
      clanstva,
      kompanijeIds: clanstva.map((c) => c.kompanijaId),
      aktivnaKompanijaId: kompanijaId,
    });
  }

  private async napraviProfil(
    uid: string,
    email: string,
    ime: string,
    p: RegistracijaPodaci
  ): Promise<void> {
    let kompanijaId = p.kompanijaId ?? '';
    let uloga: Uloga = 'laborant';

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

    const korisnik: Korisnik = {
      uid,
      email,
      ime,
      clanstva: [{ kompanijaId, uloga }],
      kompanijeIds: [kompanijaId],
      aktivnaKompanijaId: kompanijaId,
    };
    await setDoc(doc(this.firestore, 'korisnici', uid), korisnik);
  }
}

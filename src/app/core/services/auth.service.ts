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
  collection,
  addDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
    // docData je reaktivan i radi unutar Angular zone — UI se osvežava odmah po prijavi
    // (bez ovoga navbar ostaje na "Prijavi se" do ručnog refresha jer getDoc resolvuje van zone).
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
      switchMap((k) =>
        k
          ? (
              docData(doc(this.firestore, 'kompanije', k.kompanijaId), { idField: 'id' }) as Observable<
                Kompanija | undefined
              >
            ).pipe(map((c) => c ?? null))
          : of(null)
      ),
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

  // Podaci sa Google naloga (kad korisnik tek treba da izabere firmu).
  get googleIme(): string | null {
    return this.auth.currentUser?.displayName ?? null;
  }

  get imaAuthNalog(): boolean {
    return !!this.auth.currentUser;
  }

  jePrijavljen$(): Observable<boolean> {
    return authState(this.auth).pipe(map((u) => !!u));
  }

  async prijava(email: string, lozinka: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, lozinka);
  }

  // Vraća true ako Google korisnik već ima profil (i firmu); false ako tek treba da izabere firmu.
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

  // Dovršava registraciju za korisnika koji se već prijavio preko Google-a (bira firmu).
  async dovrsiGoogleProfil(p: RegistracijaPodaci): Promise<void> {
    const u = this.auth.currentUser;
    if (!u) {
      throw new Error('Nema aktivnog Google naloga.');
    }
    await this.napraviProfil(u.uid, u.email ?? '', u.displayName ?? p.ime, p);
  }

  // Zajedničko kreiranje Kompanije (ako je nova) + Korisnik profila — deljeno za email i Google.
  private async napraviProfil(
    uid: string,
    email: string,
    ime: string,
    p: RegistracijaPodaci
  ): Promise<void> {
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

    const korisnik: Korisnik = { uid, email, ime, kompanijaId, uloga };
    await setDoc(doc(this.firestore, 'korisnici', uid), korisnik);
  }
}

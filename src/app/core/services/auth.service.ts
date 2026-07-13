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

import { Korisnik, Kompanija, ClanstvoDoc, ZahtevZaPristup, Uloga } from '../models';
import { KompanijeService } from './kompanije.service';
import { ClanstvaService } from './clanstva.service';
import { ZahteviService } from './zahtevi.service';

// Podaci sa forme za registraciju.
export interface RegistracijaPodaci {
  email: string;
  lozinka: string;
  ime: string;
  nacin: 'nova' | 'postojeca' | 'demo';
  nazivKompanije?: string;
  pib?: string;
  adresa?: string;
  kontakt?: string;
  kod?: string; // kod firme kojoj se korisnik pridružuje
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  korisnik$: Observable<Korisnik | null>;
  mojaClanstva$: Observable<ClanstvoDoc[]>;
  aktivnaKompanija$: Observable<Kompanija | null>;
  // Sve firme kojima korisnik pripada (za prebacivanje u navbaru).
  mojeKompanije$: Observable<Kompanija[]>;
  // Zahtevi koje je korisnik poslao (na čekanju).
  mojiZahtevi$: Observable<ZahtevZaPristup[]>;
  // Zahtevi za firme u kojima je korisnik admin (za odobravanje).
  zahteviZaMojeFirme$: Observable<ZahtevZaPristup[]>;

  private trenutni = new BehaviorSubject<Korisnik | null>(null);
  private clanstvaSnap = new BehaviorSubject<ClanstvoDoc[]>([]);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private kompanijeServis: KompanijeService,
    private clanstvaServis: ClanstvaService,
    private zahteviServis: ZahteviService
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

    this.mojaClanstva$ = authState(this.auth).pipe(
      switchMap((user) => (user ? this.clanstvaServis.zaKorisnika(user.uid) : of([] as ClanstvoDoc[]))),
      shareReplay(1)
    );

    this.mojeKompanije$ = this.mojaClanstva$.pipe(
      switchMap((clanstva) => {
        if (!clanstva.length) return of([] as Kompanija[]);
        return combineLatest(clanstva.map((c) => this.kompanijeServis.ucitaj(c.kompanijaId))).pipe(
          map((firme) => firme.filter((f): f is Kompanija => !!f))
        );
      }),
      shareReplay(1)
    );

    this.aktivnaKompanija$ = combineLatest([this.korisnik$, this.mojaClanstva$]).pipe(
      switchMap(([k, clanstva]) => {
        const id = AuthService.aktivnaId(k, clanstva);
        return id ? this.kompanijeServis.ucitaj(id) : of(null);
      }),
      shareReplay(1)
    );

    this.mojiZahtevi$ = authState(this.auth).pipe(
      switchMap((user) => (user ? this.zahteviServis.moji(user.uid) : of([] as ZahtevZaPristup[]))),
      shareReplay(1)
    );

    this.zahteviZaMojeFirme$ = this.mojaClanstva$.pipe(
      switchMap((clanstva) => {
        const adminIds = clanstva.filter((c) => c.uloga === 'admin').map((c) => c.kompanijaId);
        return this.zahteviServis.zaFirme(adminIds);
      }),
      shareReplay(1)
    );

    this.korisnik$.subscribe((k) => this.trenutni.next(k));
    this.mojaClanstva$.subscribe((c) => this.clanstvaSnap.next(c));
  }

  // ————— izvedena aktivna firma / uloge —————

  private static aktivnaId(k: Korisnik | null, clanstva: ClanstvoDoc[]): string | null {
    if (!clanstva.length) return null;
    const ids = clanstva.map((c) => c.kompanijaId);
    const zeljena = k?.aktivnaKompanijaId ?? '';
    return ids.includes(zeljena) ? zeljena : ids[0];
  }

  get kompanijaId(): string | null {
    return AuthService.aktivnaId(this.trenutni.value, this.clanstvaSnap.value);
  }

  get jeAdmin(): boolean {
    const akt = this.kompanijaId;
    return this.clanstvaSnap.value.find((c) => c.kompanijaId === akt)?.uloga === 'admin';
  }

  get mojiKompanijeIds(): string[] {
    return this.clanstvaSnap.value.map((c) => c.kompanijaId);
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
    return combineLatest([this.korisnik$, this.mojaClanstva$]).pipe(
      map(([k, clanstva]) => AuthService.aktivnaId(k, clanstva))
    );
  }

  // ————— prijava / registracija —————

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

  // Vraća id kreirane firme (za 'nova'/'demo'), ili null za pridruživanje kodom.
  async registruj(p: RegistracijaPodaci): Promise<string | null> {
    // Kod proveravamo PRE pravljenja naloga, da ne ostane nalog bez firme.
    if (p.nacin === 'postojeca') await this.proveriKod(p.kod);
    const kredencijal = await createUserWithEmailAndPassword(this.auth, p.email, p.lozinka);
    await this.napraviProfil(kredencijal.user.uid, p.email, p.ime);
    return this.primeniNacin(p, p.ime, p.email);
  }

  async dovrsiGoogleProfil(p: RegistracijaPodaci): Promise<string | null> {
    const u = this.auth.currentUser;
    if (!u) {
      throw new Error('Nema aktivnog Google naloga.');
    }
    if (p.nacin === 'postojeca') await this.proveriKod(p.kod);
    const ime = u.displayName ?? p.ime;
    const email = u.email ?? '';
    await this.napraviProfil(u.uid, email, ime);
    return this.primeniNacin(p, ime, email);
  }

  // Baca ako kod ne postoji (koristi se pre registracije).
  private async proveriKod(kod?: string): Promise<void> {
    const firma = await this.kompanijeServis.razresiKod((kod ?? '').trim().toUpperCase());
    if (!firma) throw new Error('KOD_NE_POSTOJI');
  }

  // Nova firma / demo firma / zahtev za pridruživanje — u zavisnosti od izbora na formi.
  // Vraća id firme ako je napravljena, inače null.
  private async primeniNacin(
    p: RegistracijaPodaci,
    ime: string,
    email: string
  ): Promise<string | null> {
    if (p.nacin === 'nova') {
      return this.napraviKompaniju({
        naziv: p.nazivKompanije ?? '',
        pib: p.pib,
        adresa: p.adresa,
        kontakt: p.kontakt,
      });
    }
    if (p.nacin === 'demo') {
      return this.napraviKompaniju({ naziv: 'Demo firma' });
    }
    await this.posaljiZahtev(p.kod ?? '', ime, email);
    return null;
  }

  // ————— firme: kreiranje / pridruživanje kodom / prebacivanje —————

  async promeniKompaniju(kompanijaId: string): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    await updateDoc(doc(this.firestore, 'korisnici', uid), { aktivnaKompanijaId: kompanijaId });
  }

  // Napravi novu firmu, postani njen admin, upiši kod i pređi na nju. Vraća id firme.
  async napraviKompaniju(podaci: {
    naziv: string;
    pib?: string;
    adresa?: string;
    kontakt?: string;
  }): Promise<string> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return '';
    await this.osigurajProfil();
    const kod = await this.generisiKod();
    const ref = await addDoc(collection(this.firestore, 'kompanije'), {
      naziv: podaci.naziv,
      pib: podaci.pib ?? '',
      adresa: podaci.adresa ?? '',
      kontakt: podaci.kontakt ?? '',
      datumRegistracije: new Date().toISOString(),
      aktivan: true,
      kod,
      osnivacUid: uid,
    });
    await this.clanstvaServis.dodeli(ref.id, uid, 'admin');
    await this.kompanijeServis.upisiKod(kod, { kompanijaId: ref.id, naziv: podaci.naziv });
    await updateDoc(doc(this.firestore, 'korisnici', uid), { aktivnaKompanijaId: ref.id });
    return ref.id;
  }

  // Pošalji zahtev za pristup firmi preko koda (čeka odobrenje admina).
  async posaljiZahtev(kod: string, ime?: string, email?: string): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Niste prijavljeni.');
    await this.osigurajProfil();
    const kodN = kod.trim().toUpperCase();
    if (!kodN) throw new Error('KOD_PRAZAN');

    const firma = await this.kompanijeServis.razresiKod(kodN);
    if (!firma) throw new Error('KOD_NE_POSTOJI');
    if (this.clanstvaSnap.value.some((c) => c.kompanijaId === firma.kompanijaId)) {
      throw new Error('VEC_CLAN');
    }

    await this.zahteviServis.posalji({
      kompanijaId: firma.kompanijaId,
      kompanijaNaziv: firma.naziv,
      uid,
      email: email ?? this.auth.currentUser?.email ?? this.trenutni.value?.email ?? '',
      ime: ime ?? this.trenutni.value?.ime ?? this.auth.currentUser?.displayName ?? '',
      status: 'na_cekanju',
      datum: new Date().toISOString(),
    });
  }

  // ————— odobravanje zahteva (admin) —————

  async odobri(zahtev: ZahtevZaPristup): Promise<void> {
    await this.clanstvaServis.dodeli(zahtev.kompanijaId, zahtev.uid, 'laborant');
    await this.zahteviServis.obrisi(zahtev.id);
  }

  async odbij(zahtev: ZahtevZaPristup): Promise<void> {
    await this.zahteviServis.obrisi(zahtev.id);
  }

  // ————— pomoćne —————

  private async napraviProfil(uid: string, email: string, ime: string): Promise<void> {
    const korisnik: Korisnik = { uid, email, ime, aktivnaKompanijaId: '' };
    await setDoc(doc(this.firestore, 'korisnici', uid), korisnik);
  }

  // Ako je korisnik prijavljen ali nema profil (npr. posle reseta baze) — napravi ga.
  private async osigurajProfil(): Promise<void> {
    const u = this.auth.currentUser;
    if (!u) return;
    const ref = doc(this.firestore, 'korisnici', u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await this.napraviProfil(u.uid, u.email ?? '', u.displayName ?? '');
    }
  }

  private async generisiKod(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const kod = AuthService.nasumicanKod();
      if (!(await this.kompanijeServis.postojiKod(kod))) return kod;
    }
    return AuthService.nasumicanKod();
  }

  private static nasumicanKod(): string {
    // Bez zbunjujućih znakova (0/O, 1/I/L).
    const azbuka = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 4; i++) s += azbuka[Math.floor(Math.random() * azbuka.length)];
    return `LAB-${s}`;
  }

  // Uloga u datoj firmi (za prikaz).
  ulogaU(kompanijaId: string): Uloga | null {
    return this.clanstvaSnap.value.find((c) => c.kompanijaId === kompanijaId)?.uloga ?? null;
  }
}

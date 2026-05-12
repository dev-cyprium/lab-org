export type Uloga = 'laborant' | 'admin';

export interface Korisnik {
  uid: string; // Firebase Auth UID
  email: string;
  ime: string;
  kompanijaId: string; // ref → Kompanija (određuje koje podatke korisnik vidi)
  uloga: Uloga;
  zaposleniId?: string; // ref → Zaposleni profil
}

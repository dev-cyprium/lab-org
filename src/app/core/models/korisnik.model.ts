export type Uloga = 'laborant' | 'admin';

export interface Korisnik {
  uid: string; // Firebase Auth UID
  email: string;
  ime: string;
  uloga: Uloga;
  zaposleniId?: string; // ref → Zaposleni profil
}

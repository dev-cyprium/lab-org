export type Uloga = 'laborant' | 'admin';

// Članstvo korisnika u jednoj firmi (sa ulogom u toj firmi) — u memoriji.
export interface Clanstvo {
  kompanijaId: string;
  uloga: Uloga;
}

// Profil korisnika. Članstva NISU više ovde (izvor istine je kolekcija `clanstva`,
// koju kontrolišu security rules) — ovde stoje samo lični podaci i izbor aktivne firme.
export interface Korisnik {
  uid: string; // Firebase Auth UID
  email: string;
  ime: string;
  aktivnaKompanijaId: string; // trenutno izabrana firma (samo UI preferenca)
  // Stara polja — samo radi kompatibilnosti sa starijim nalozima.
  clanstva?: Clanstvo[];
  kompanijeIds?: string[];
  kompanijaId?: string;
  uloga?: Uloga;
}

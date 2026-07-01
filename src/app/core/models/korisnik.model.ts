export type Uloga = 'laborant' | 'admin';

// Članstvo korisnika u jednoj firmi (sa ulogom u toj firmi).
export interface Clanstvo {
  kompanijaId: string;
  uloga: Uloga;
}

export interface Korisnik {
  uid: string; // Firebase Auth UID
  email: string;
  ime: string;
  clanstva: Clanstvo[]; // firme kojima korisnik pripada
  kompanijeIds: string[]; // denormalizovano (radi Firestore security rules)
  aktivnaKompanijaId: string; // trenutno izabrana firma
  // Stara polja — samo radi kompatibilnosti sa nalozima napravljenim pre više-tenant izmene.
  kompanijaId?: string;
  uloga?: Uloga;
}

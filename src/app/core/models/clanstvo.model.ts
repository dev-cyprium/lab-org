import { Uloga } from './korisnik.model';

// Dokument u kolekciji `clanstva` — izvor istine o tome ko pripada kojoj firmi.
// Id dokumenta je deterministički: `${kompanijaId}__${uid}`.
export interface ClanstvoDoc {
  id: string;
  kompanijaId: string;
  uid: string;
  uloga: Uloga;
}

// Napravi deterministički id članstva/zahteva iz (firma, korisnik).
export function clanstvoId(kompanijaId: string, uid: string): string {
  return `${kompanijaId}__${uid}`;
}

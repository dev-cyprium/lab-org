export type Pozicija =
  | 'uzorkovač'
  | 'laborant'
  | 'analitičar'
  | 'mikrobiolog'
  | 'šef laboratorije'
  | 'kontrolor kvaliteta';

export interface Zaposleni {
  id: string;
  kompanijaId: string; // tenant vlasnik
  ime: string;
  prezime: string;
  pozicija: Pozicija;
  email: string;
  telefon: string;
  strucnaSprema: string;
  laboratorijaId: string; // ref → Laboratorija
  datumZaposlenja: string; // ISO
  aktivan: boolean;
}

export const POZICIJE: Pozicija[] = [
  'uzorkovač',
  'laborant',
  'analitičar',
  'mikrobiolog',
  'šef laboratorije',
  'kontrolor kvaliteta',
];

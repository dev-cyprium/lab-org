export type VrstaUzorka =
  | 'namirnica'
  | 'voda'
  | 'bris površine'
  | 'sirovina'
  | 'gotov proizvod';
export type StatusUzorka = 'primljen' | 'u analizi' | 'završen' | 'arhiviran';

export interface Uzorak {
  id: string;
  kompanijaId: string; // tenant vlasnik
  sifra: string; // npr "UZ-2026-0001"
  vrsta: VrstaUzorka;
  naziv: string; // npr "Pileće grudi", "Voda za piće - bunar 3"
  poreklo: string; // klijent / objekat sa kog je uzorak
  uzorkovacId: string; // ref → Zaposleni koji je doneo uzorak
  laboratorijaId: string; // ref → Laboratorija
  datumUzorkovanja: string; // ISO
  datumPrijema: string; // ISO
  kolicina: number;
  jedinica: string; // "g", "mL"
  temperaturaPrijema: number; // °C, kontrola hladnog lanca
  lokacijaUzorkovanja: string;
  status: StatusUzorka;
}

export const VRSTE_UZORKA: VrstaUzorka[] = [
  'namirnica',
  'voda',
  'bris površine',
  'sirovina',
  'gotov proizvod',
];

export const STATUSI_UZORKA: StatusUzorka[] = [
  'primljen',
  'u analizi',
  'završen',
  'arhiviran',
];

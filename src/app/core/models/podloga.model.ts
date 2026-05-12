export type TipPodloge = 'podloga' | 'reagens' | 'hemikalija';
export type KlasaOpasnosti =
  | 'zapaljivo'
  | 'korozivno'
  | 'toksično'
  | 'nadražujuće'
  | 'bez oznake';

export interface Podloga {
  id: string;
  kompanijaId: string; // tenant vlasnik
  naziv: string; // npr "XLD agar", "Baird-Parker"
  tip: TipPodloge;
  namena: string; // ciljni organizam ili parametar
  koncentracija: string;
  kolicina: number;
  jedinica: string; // "g", "mL", "kom"
  klasaOpasnosti: KlasaOpasnosti;
  datumIsteka: string; // ISO datum
  proizvodjac: string;
  lokacija: string; // gde stoji u magacinu/frižideru
}

export const KLASE_OPASNOSTI: KlasaOpasnosti[] = [
  'zapaljivo',
  'korozivno',
  'toksično',
  'nadražujuće',
  'bez oznake',
];

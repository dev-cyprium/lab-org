export type TipLaboratorije =
  | 'mikrobiološka'
  | 'hemijska'
  | 'fizičko-hemijska'
  | 'senzorska';

export interface Laboratorija {
  id: string;
  kompanijaId: string; // tenant vlasnik
  naziv: string;
  tip: TipLaboratorije;
  lokacija: string;
  kontakt: string;
  sefId: string; // ref → Zaposleni (šef laboratorije)
  opis: string;
}

export const TIPOVI_LABORATORIJE: TipLaboratorije[] = [
  'mikrobiološka',
  'hemijska',
  'fizičko-hemijska',
  'senzorska',
];

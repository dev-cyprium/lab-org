// Tenant — firma (klijent) koja ima svoje laboratorije i podatke.
export interface Kompanija {
  id: string;
  naziv: string;
  pib: string; // poreski identifikacioni broj
  adresa: string;
  kontakt: string;
  datumRegistracije: string; // ISO
  aktivan: boolean;
}

// Tenant — firma (klijent) koja ima svoje laboratorije i podatke.
export interface Kompanija {
  id: string;
  naziv: string;
  pib: string; // poreski identifikacioni broj
  adresa: string;
  kontakt: string;
  datumRegistracije: string; // ISO
  aktivan: boolean;
  kod: string; // deljivi kod za pridruživanje (npr. LAB-7F3X)
  osnivacUid: string; // uid korisnika koji je napravio firmu (za security rules)
}

// Javni pokazivač koda -> firma. Čita se samo ako se zna tačan kod (get po id-u),
// pa se firme ne mogu izlistati ni pretraživati.
export interface KompanijaKod {
  kompanijaId: string;
  naziv: string;
}

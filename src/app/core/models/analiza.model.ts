export type TipAnalize = 'mikrobiološka' | 'hemijska';
export type StatusStavke = 'ispravan' | 'neispravan';
export type Ocena = 'ISPRAVAN' | 'NEISPRAVAN';

// Jedna izmerena stavka u okviru analize (npr. "Salmonella spp.").
export interface StavkaAnalize {
  parametar: string;
  mikroorganizamId?: string; // ref → Mikroorganizam (za mikrobiološke parametre)
  vrednost: string | number; // može biti broj (CFU) ili tekst ("odsutna")
  jedinica: string; // "CFU/g", "CFU/100mL", "mg/kg"...
  granica: string; // maksimalno dozvoljeno
  status: StatusStavke;
}

export interface Analiza {
  id: string;
  kompanijaId: string; // tenant vlasnik
  sifra: string; // npr "AN-2026-0001"
  uzorakId: string; // ref → Uzorak
  zaposleniId: string; // ref → Zaposleni (analitičar)
  tip: TipAnalize;
  metoda: string; // standard, npr "SRPS EN ISO 6579-1"
  datumAnalize: string; // ISO
  stavke: StavkaAnalize[]; // ugnježđen niz rezultata
  zakljucak: Ocena; // dovoljna je jedna neispravna stavka za NEISPRAVAN
}

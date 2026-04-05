export type TipMikroorganizma = 'patogen' | 'indikator' | 'kvarljivac' | 'kvasac/plesan';
export type GramBojenje = 'pozitivna' | 'negativna' | 'n/p';
export type OblikMikroorganizma = 'koke' | 'bacili' | 'spirili' | 'vibrio' | 'n/p';

export interface Mikroorganizam {
  id: string;
  naziv: string;
  latinskiNaziv: string;
  tip: TipMikroorganizma;
  gram: GramBojenje;
  oblik: OblikMikroorganizma;
  rizik: string; // oboljenje ili rizik koji izaziva
  tipicneNamirnice: string[]; // gde se najčešće javlja
  granicaCFU: string; // referentna granica, npr "odsutna u 25 g" ili "100 CFU/g"
  opis: string;
  slikaUrl?: string;
}

// Opcije za filtere i forme — da se ne kuca na više mesta.
export const TIPOVI_MIKROORGANIZAMA: TipMikroorganizma[] = [
  'patogen',
  'indikator',
  'kvarljivac',
  'kvasac/plesan',
];

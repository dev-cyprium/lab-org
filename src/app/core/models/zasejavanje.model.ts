export type RezultatZasejavanja =
  | 'izraslo'
  | 'nije izraslo'
  | 'kontaminirano'
  | 'u toku';

export interface Zasejavanje {
  id: string;
  oznaka: string;
  uzorakId: string; // ref → Uzorak koji je zasejan
  podlogaId: string; // ref → Podloga
  mikroorganizamId: string; // ref → ciljni Mikroorganizam koji tražimo
  datumZasejavanja: string; // ISO
  temperatura: number; // °C inkubacije
  vremeInkubacije: number; // sati
  brojKolonija: number; // CFU
  rezultat: RezultatZasejavanja;
}

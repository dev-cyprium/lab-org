// Zahtev korisnika da mu se odobri pristup firmi (preko koda).
// Id dokumenta je deterministički: `${kompanijaId}__${uid}` (jedan zahtev po firmi).
export interface ZahtevZaPristup {
  id: string;
  kompanijaId: string;
  kompanijaNaziv: string; // denormalizovano — da podnosilac vidi ime firme dok čeka
  uid: string; // podnosilac
  email: string; // denormalizovano — da admin vidi ko traži pristup
  ime: string; // denormalizovano
  status: 'na_cekanju'; // odobreni/odbijeni se brišu, pa u bazi ostaju samo aktivni
  datum: string; // ISO
}

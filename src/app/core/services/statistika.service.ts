import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Analiza, Podloga, Uzorak, Zasejavanje } from '../models';
import { AnalizeService } from './analize.service';
import { PodlogeService } from './podloge.service';
import { UzorciService } from './uzorci.service';
import { ZasejavanjaService } from './zasejavanja.service';

export interface TokRada {
  primljeni: number;
  zasejani: number;
  uAnalizi: number;
  zavrseni: number;
}

export interface Prioritet {
  naslov: string;
  opis: string;
  putanja: string;
  ikonica: string;
  nivo: 'kriticno' | 'upozorenje' | 'informacija';
}

export interface Aktivnost {
  naslov: string;
  opis: string;
  datum: string;
  putanja: string;
  ikonica: string;
}

export interface Statistika {
  ukupnoUzoraka: number;
  uAnalizi: number;
  ukupnoAnaliza: number;
  ispravnih: number;
  neispravnih: number;
  procenatIspravnih: number;
  procenatNeispravnih: number;
  istekloPodloga: number;
  tokRada: TokRada;
  prioriteti: Prioritet[];
  aktivnosti: Aktivnost[];
}

@Injectable({ providedIn: 'root' })
export class StatistikaService {
  constructor(
    private uzorciServis: UzorciService,
    private analizeServis: AnalizeService,
    private podlogeServis: PodlogeService,
    private zasejavanjaServis: ZasejavanjaService
  ) {}

  ucitajStatistiku(): Observable<Statistika> {
    return forkJoin({
      uzorci: this.uzorciServis.ucitajSve(),
      analize: this.analizeServis.ucitajSve(),
      podloge: this.podlogeServis.ucitajSve(),
      zasejavanja: this.zasejavanjaServis.ucitajSve(),
    }).pipe(
      map(({ uzorci, analize, podloge, zasejavanja }) =>
        this.izracunaj(uzorci, analize, podloge, zasejavanja)
      )
    );
  }

  private izracunaj(
    uzorci: Uzorak[],
    analize: Analiza[],
    podloge: Podloga[],
    zasejavanja: Zasejavanje[]
  ): Statistika {
    const neispravne = analize.filter((a) => a.zakljucak === 'NEISPRAVAN');
    const ispravnih = analize.length - neispravne.length;
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);
    const istekle = podloge.filter((p) => new Date(p.datumIsteka) < danas);
    const zasejaniUzorci = new Set(zasejavanja.map((z) => z.uzorakId));

    return {
      ukupnoUzoraka: uzorci.length,
      uAnalizi: uzorci.filter((u) => u.status === 'u analizi' || u.status === 'primljen').length,
      ukupnoAnaliza: analize.length,
      ispravnih,
      neispravnih: neispravne.length,
      procenatIspravnih: analize.length ? Math.round((ispravnih / analize.length) * 100) : 0,
      procenatNeispravnih: analize.length
        ? Math.round((neispravne.length / analize.length) * 100)
        : 0,
      istekloPodloga: istekle.length,
      tokRada: {
        primljeni: uzorci.filter((u) => u.status === 'primljen' && !zasejaniUzorci.has(u.id)).length,
        zasejani: uzorci.filter((u) => u.status === 'primljen' && zasejaniUzorci.has(u.id)).length,
        uAnalizi: uzorci.filter((u) => u.status === 'u analizi').length,
        zavrseni: uzorci.filter((u) => u.status === 'završen').length,
      },
      prioriteti: this.prioriteti(uzorci, neispravne, istekle),
      aktivnosti: this.aktivnosti(uzorci, analize, zasejavanja),
    };
  }

  private prioriteti(
    uzorci: Uzorak[],
    neispravne: Analiza[],
    istekle: Podloga[]
  ): Prioritet[] {
    const neispravniPrioriteti = [...neispravne]
      .sort((a, b) => b.datumAnalize.localeCompare(a.datumAnalize))
      .map((a) => ({
        naslov: `Neispravan nalaz ${a.sifra}`,
        opis: `${a.tip} analiza zahteva proveru`,
        putanja: `/analize/${a.id}`,
        ikonica: 'gpp_bad',
        nivo: 'kriticno' as const,
      }));
    const istekliPrioriteti = [...istekle]
      .sort((a, b) => a.datumIsteka.localeCompare(b.datumIsteka))
      .map((p) => ({
        naslov: `Istekla podloga: ${p.naziv}`,
        opis: 'Rok upotrebe je istekao',
        putanja: `/podloge/${p.id}`,
        ikonica: 'event_busy',
        nivo: 'upozorenje' as const,
      }));
    const primljeniPrioriteti = uzorci
      .filter((u) => u.status === 'primljen')
      .sort((a, b) => a.datumPrijema.localeCompare(b.datumPrijema))
      .map((u) => ({
        naslov: `${u.sifra} čeka obradu`,
        opis: `${u.naziv} · primljen ${u.datumPrijema}`,
        putanja: `/uzorci/${u.id}`,
        ikonica: 'science',
        nivo: 'informacija' as const,
      }));

    return [...neispravniPrioriteti, ...istekliPrioriteti, ...primljeniPrioriteti].slice(0, 6);
  }

  private aktivnosti(
    uzorci: Uzorak[],
    analize: Analiza[],
    zasejavanja: Zasejavanje[]
  ): Aktivnost[] {
    const prijemi = uzorci.map((u) => ({
      naslov: `Primljen uzorak ${u.sifra}`,
      opis: u.naziv,
      datum: u.datumPrijema,
      putanja: `/uzorci/${u.id}`,
      ikonica: 'science',
    }));
    const zavrseneAnalize = analize.map((a) => ({
      naslov: `Završena analiza ${a.sifra}`,
      opis: a.zakljucak === 'ISPRAVAN' ? 'Nalaz je ispravan' : 'Nalaz je neispravan',
      datum: a.datumAnalize,
      putanja: `/analize/${a.id}`,
      ikonica: 'fact_check',
    }));
    const zasejano = zasejavanja.map((z) => ({
      naslov: `Evidentirano zasejavanje ${z.oznaka}`,
      opis: z.rezultat,
      datum: z.datumZasejavanja,
      putanja: `/zasejavanja/${z.id}`,
      ikonica: 'grain',
    }));

    return [...prijemi, ...zavrseneAnalize, ...zasejano]
      .sort((a, b) => b.datum.localeCompare(a.datum))
      .slice(0, 6);
  }
}

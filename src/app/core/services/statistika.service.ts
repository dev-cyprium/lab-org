import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { UzorciService } from './uzorci.service';
import { AnalizeService } from './analize.service';
import { PodlogeService } from './podloge.service';

export interface Statistika {
  ukupnoUzoraka: number;
  uAnalizi: number;
  ukupnoAnaliza: number;
  ispravnih: number;
  neispravnih: number;
  procenatNeispravnih: number;
  istekloPodloga: number;
}

// Računa zbirne pokazatelje za dashboard iz postojećih servisa.
@Injectable({ providedIn: 'root' })
export class StatistikaService {
  constructor(
    private uzorciServis: UzorciService,
    private analizeServis: AnalizeService,
    private podlogeServis: PodlogeService
  ) {}

  ucitajStatistiku(): Observable<Statistika> {
    return forkJoin({
      uzorci: this.uzorciServis.ucitajSve(),
      analize: this.analizeServis.ucitajSve(),
      podloge: this.podlogeServis.ucitajSve(),
    }).pipe(
      map(({ uzorci, analize, podloge }) => {
        const neispravnih = analize.filter((a) => a.zakljucak === 'NEISPRAVAN').length;
        const ukupnoAnaliza = analize.length;
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);

        return {
          ukupnoUzoraka: uzorci.length,
          uAnalizi: uzorci.filter((u) => u.status === 'u analizi' || u.status === 'primljen').length,
          ukupnoAnaliza,
          ispravnih: ukupnoAnaliza - neispravnih,
          neispravnih,
          procenatNeispravnih: ukupnoAnaliza
            ? Math.round((neispravnih / ukupnoAnaliza) * 100)
            : 0,
          istekloPodloga: podloge.filter((p) => new Date(p.datumIsteka) < danas).length,
        };
      })
    );
  }
}

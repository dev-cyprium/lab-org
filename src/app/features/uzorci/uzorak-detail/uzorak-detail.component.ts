import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Uzorak, Zaposleni, Laboratorija, Zasejavanje, Analiza } from '../../../core/models';
import { UzorciService } from '../../../core/services/uzorci.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { ZasejavanjaService } from '../../../core/services/zasejavanja.service';
import { AnalizeService } from '../../../core/services/analize.service';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';
import { PodlogeService } from '../../../core/services/podloge.service';

// Pomoćni tip za prikaz zasejavanja sa razrešenim nazivima.
interface ZasejavanjeRed {
  zasejavanje: Zasejavanje;
  podloga: string;
  mikroorganizam: string;
}

@Component({
  selector: 'app-uzorak-detail',
  templateUrl: './uzorak-detail.component.html',
  styleUrl: './uzorak-detail.component.scss',
})
export class UzorakDetailComponent implements OnInit {
  uzorak?: Uzorak;
  uzorkovac?: Zaposleni;
  laboratorija?: Laboratorija;
  zasejavanja: ZasejavanjeRed[] = [];
  analize: Analiza[] = [];
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private uzorciServis: UzorciService,
    private zaposleniServis: ZaposleniService,
    private laboratorijeServis: LaboratorijeService,
    private zasejavanjaServis: ZasejavanjaService,
    private analizeServis: AnalizeService,
    private mikroorganizmiServis: MikroorganizmiService,
    private podlogeServis: PodlogeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      uzorak: this.uzorciServis.ucitajJedan(id),
      zaposleni: this.zaposleniServis.ucitajSve(),
      labovi: this.laboratorijeServis.ucitajSve(),
      zasejavanja: this.zasejavanjaServis.ucitajSve(),
      analize: this.analizeServis.ucitajSve(),
      mikroorganizmi: this.mikroorganizmiServis.ucitajSve(),
      podloge: this.podlogeServis.ucitajSve(),
    }).subscribe((r) => {
      this.uzorak = r.uzorak;
      if (r.uzorak) {
        const u = r.uzorak;
        this.uzorkovac = r.zaposleni.find((z) => z.id === u.uzorkovacId);
        this.laboratorija = r.labovi.find((l) => l.id === u.laboratorijaId);
        this.analize = r.analize.filter((a) => a.uzorakId === u.id);
        this.zasejavanja = r.zasejavanja
          .filter((z) => z.uzorakId === u.id)
          .map((z) => ({
            zasejavanje: z,
            podloga: r.podloge.find((p) => p.id === z.podlogaId)?.naziv ?? '—',
            mikroorganizam: r.mikroorganizmi.find((m) => m.id === z.mikroorganizamId)?.naziv ?? '—',
          }));
      }
      this.ucitavanje = false;
    });
  }
}

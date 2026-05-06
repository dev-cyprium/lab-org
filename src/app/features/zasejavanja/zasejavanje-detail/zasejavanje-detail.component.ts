import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Zasejavanje, Uzorak, Podloga, Mikroorganizam } from '../../../core/models';
import { ZasejavanjaService } from '../../../core/services/zasejavanja.service';
import { UzorciService } from '../../../core/services/uzorci.service';
import { PodlogeService } from '../../../core/services/podloge.service';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';

@Component({
  selector: 'app-zasejavanje-detail',
  templateUrl: './zasejavanje-detail.component.html',
  styleUrl: './zasejavanje-detail.component.scss',
})
export class ZasejavanjeDetailComponent implements OnInit {
  zasejavanje?: Zasejavanje;
  uzorak?: Uzorak;
  podloga?: Podloga;
  mikroorganizam?: Mikroorganizam;
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private zasejavanjaServis: ZasejavanjaService,
    private uzorciServis: UzorciService,
    private podlogeServis: PodlogeService,
    private mikroorganizmiServis: MikroorganizmiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      zasejavanje: this.zasejavanjaServis.ucitajJedan(id),
      uzorci: this.uzorciServis.ucitajSve(),
      podloge: this.podlogeServis.ucitajSve(),
      mikroorganizmi: this.mikroorganizmiServis.ucitajSve(),
    }).subscribe((r) => {
      this.zasejavanje = r.zasejavanje;
      if (r.zasejavanje) {
        const z = r.zasejavanje;
        this.uzorak = r.uzorci.find((u) => u.id === z.uzorakId);
        this.podloga = r.podloge.find((p) => p.id === z.podlogaId);
        this.mikroorganizam = r.mikroorganizmi.find((m) => m.id === z.mikroorganizamId);
      }
      this.ucitavanje = false;
    });
  }
}

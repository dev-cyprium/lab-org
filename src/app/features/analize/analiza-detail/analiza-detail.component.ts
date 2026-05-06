import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Analiza, Uzorak, Zaposleni } from '../../../core/models';
import { AnalizeService } from '../../../core/services/analize.service';
import { UzorciService } from '../../../core/services/uzorci.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';

@Component({
  selector: 'app-analiza-detail',
  templateUrl: './analiza-detail.component.html',
  styleUrl: './analiza-detail.component.scss',
})
export class AnalizaDetailComponent implements OnInit {
  analiza?: Analiza;
  uzorak?: Uzorak;
  analiticar?: Zaposleni;
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private analizeServis: AnalizeService,
    private uzorciServis: UzorciService,
    private zaposleniServis: ZaposleniService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      analiza: this.analizeServis.ucitajJedan(id),
      uzorci: this.uzorciServis.ucitajSve(),
      zaposleni: this.zaposleniServis.ucitajSve(),
    }).subscribe(({ analiza, uzorci, zaposleni }) => {
      this.analiza = analiza;
      if (analiza) {
        this.uzorak = uzorci.find((u) => u.id === analiza.uzorakId);
        this.analiticar = zaposleni.find((z) => z.id === analiza.zaposleniId);
      }
      this.ucitavanje = false;
    });
  }
}

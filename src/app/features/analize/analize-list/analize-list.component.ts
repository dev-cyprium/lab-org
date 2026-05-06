import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Analiza, Ocena } from '../../../core/models';
import { AnalizeService } from '../../../core/services/analize.service';
import { UzorciService } from '../../../core/services/uzorci.service';

@Component({
  selector: 'app-analize-list',
  templateUrl: './analize-list.component.html',
  styleUrl: './analize-list.component.scss',
})
export class AnalizeListComponent implements OnInit {
  private sve: Analiza[] = [];
  prikazane: Analiza[] = [];
  uzorci = new Map<string, string>(); // uzorakId -> naziv

  pretraga = '';
  ocenaFilter: Ocena | 'sve' = 'sve';

  ucitavanje = true;
  kolone = ['sifra', 'uzorak', 'tip', 'datum', 'zakljucak'];

  constructor(private analizeServis: AnalizeService, private uzorciServis: UzorciService) {}

  ngOnInit(): void {
    forkJoin({
      analize: this.analizeServis.ucitajSve(),
      uzorci: this.uzorciServis.ucitajSve(),
    }).subscribe(({ analize, uzorci }) => {
      uzorci.forEach((u) => this.uzorci.set(u.id, u.naziv));
      this.sve = analize;
      this.prikazane = analize;
      this.ucitavanje = false;
    });
  }

  filtriraj(): void {
    const t = this.pretraga.trim().toLowerCase();
    this.prikazane = this.sve.filter((a) => {
      const nazivUzorka = (this.uzorci.get(a.uzorakId) ?? '').toLowerCase();
      const odgovaraTekst = !t || a.sifra.toLowerCase().includes(t) || nazivUzorka.includes(t);
      const odgovaraOcena = this.ocenaFilter === 'sve' || a.zakljucak === this.ocenaFilter;
      return odgovaraTekst && odgovaraOcena;
    });
  }
}

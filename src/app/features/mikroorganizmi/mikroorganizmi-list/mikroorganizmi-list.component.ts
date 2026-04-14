import { Component, OnInit } from '@angular/core';

import { Mikroorganizam, TipMikroorganizma, TIPOVI_MIKROORGANIZAMA } from '../../../core/models';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';

@Component({
  selector: 'app-mikroorganizmi-list',
  templateUrl: './mikroorganizmi-list.component.html',
  styleUrl: './mikroorganizmi-list.component.scss',
})
export class MikroorganizmiListComponent implements OnInit {
  private svi: Mikroorganizam[] = [];
  prikazani: Mikroorganizam[] = [];

  pretraga = '';
  tipFilter: TipMikroorganizma | 'svi' = 'svi';
  tipovi = TIPOVI_MIKROORGANIZAMA;

  ucitavanje = true;
  greska = false;

  kolone = ['naziv', 'latinski', 'tip', 'gram', 'granica'];

  constructor(private servis: MikroorganizmiService) {}

  ngOnInit(): void {
    this.servis.ucitajSve().subscribe({
      next: (lista) => {
        this.svi = lista;
        this.prikazani = lista;
        this.ucitavanje = false;
      },
      error: () => {
        this.greska = true;
        this.ucitavanje = false;
      },
    });
  }

  // Filtrira po tekstu pretrage i izabranom tipu.
  filtriraj(): void {
    const t = this.pretraga.trim().toLowerCase();
    this.prikazani = this.svi.filter((m) => {
      const odgovaraTekst =
        !t ||
        m.naziv.toLowerCase().includes(t) ||
        m.latinskiNaziv.toLowerCase().includes(t) ||
        m.tipicneNamirnice.some((n) => n.toLowerCase().includes(t));
      const odgovaraTip = this.tipFilter === 'svi' || m.tip === this.tipFilter;
      return odgovaraTekst && odgovaraTip;
    });
  }
}

import { Component, OnInit } from '@angular/core';

import { Podloga, TipPodloge } from '../../../core/models';
import { PodlogeService } from '../../../core/services/podloge.service';

@Component({
  selector: 'app-podloge-list',
  templateUrl: './podloge-list.component.html',
  styleUrl: './podloge-list.component.scss',
})
export class PodlogeListComponent implements OnInit {
  private sve: Podloga[] = [];
  prikazane: Podloga[] = [];

  pretraga = '';
  tipFilter: TipPodloge | 'sve' = 'sve';
  tipovi: TipPodloge[] = ['podloga', 'reagens', 'hemikalija'];

  ucitavanje = true;

  constructor(private servis: PodlogeService) {}

  ngOnInit(): void {
    this.servis.ucitajSve().subscribe((lista) => {
      this.sve = lista;
      this.prikazane = lista;
      this.ucitavanje = false;
    });
  }

  get imaAktivneFiltere(): boolean { return !!this.pretraga.trim() || this.tipFilter !== 'sve'; }

  ocistiFiltere(): void {
    this.pretraga = '';
    this.tipFilter = 'sve';
    this.filtriraj();
  }

  filtriraj(): void {
    const t = this.pretraga.trim().toLowerCase();
    this.prikazane = this.sve.filter((p) => {
      const odgovaraTekst =
        !t || p.naziv.toLowerCase().includes(t) || p.namena.toLowerCase().includes(t);
      const odgovaraTip = this.tipFilter === 'sve' || p.tip === this.tipFilter;
      return odgovaraTekst && odgovaraTip;
    });
  }
}

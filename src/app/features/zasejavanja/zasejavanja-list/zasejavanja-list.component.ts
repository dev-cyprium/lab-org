import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Zasejavanje, RezultatZasejavanja } from '../../../core/models';
import { ZasejavanjaService } from '../../../core/services/zasejavanja.service';
import { UzorciService } from '../../../core/services/uzorci.service';
import { PodlogeService } from '../../../core/services/podloge.service';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';

@Component({
  selector: 'app-zasejavanja-list',
  templateUrl: './zasejavanja-list.component.html',
  styleUrl: './zasejavanja-list.component.scss',
})
export class ZasejavanjaListComponent implements OnInit {
  private sva: Zasejavanje[] = [];
  prikazana: Zasejavanje[] = [];

  uzorci = new Map<string, string>();
  podloge = new Map<string, string>();
  mikroorganizmi = new Map<string, string>();

  pretraga = '';
  rezultatFilter: RezultatZasejavanja | 'svi' = 'svi';
  rezultati: RezultatZasejavanja[] = ['u toku', 'izraslo', 'nije izraslo', 'kontaminirano'];
  ucitavanje = true;
  kolone = ['oznaka', 'uzorak', 'podloga', 'organizam', 'kolonije', 'rezultat'];

  constructor(
    private zasejavanjaServis: ZasejavanjaService,
    private uzorciServis: UzorciService,
    private podlogeServis: PodlogeService,
    private mikroorganizmiServis: MikroorganizmiService
  ) {}

  ngOnInit(): void {
    forkJoin({
      zasejavanja: this.zasejavanjaServis.ucitajSve(),
      uzorci: this.uzorciServis.ucitajSve(),
      podloge: this.podlogeServis.ucitajSve(),
      mikroorganizmi: this.mikroorganizmiServis.ucitajSve(),
    }).subscribe((r) => {
      r.uzorci.forEach((u) => this.uzorci.set(u.id, u.naziv));
      r.podloge.forEach((p) => this.podloge.set(p.id, p.naziv));
      r.mikroorganizmi.forEach((m) => this.mikroorganizmi.set(m.id, m.naziv));
      this.sva = [...r.zasejavanja].sort((a, b) => b.datumZasejavanja.localeCompare(a.datumZasejavanja));
      this.prikazana = this.sva;
      this.ucitavanje = false;
    });
  }

  get imaAktivneFiltere(): boolean {
    return !!this.pretraga.trim() || this.rezultatFilter !== 'svi';
  }

  ukloniPretragu(): void {
    this.pretraga = '';
    this.filtriraj();
  }

  ukloniRezultat(): void {
    this.rezultatFilter = 'svi';
    this.filtriraj();
  }

  ocistiFiltere(): void {
    this.pretraga = '';
    this.rezultatFilter = 'svi';
    this.filtriraj();
  }

  filtriraj(): void {
    const t = this.pretraga.trim().toLowerCase();
    this.prikazana = this.sva.filter((z) => {
      const uzorak = (this.uzorci.get(z.uzorakId) ?? '').toLowerCase();
      const organizam = (this.mikroorganizmi.get(z.mikroorganizamId) ?? '').toLowerCase();
      const odgovaraTekst = !t || z.oznaka.toLowerCase().includes(t) || uzorak.includes(t) || organizam.includes(t);
      const odgovaraRezultat = this.rezultatFilter === 'svi' || z.rezultat === this.rezultatFilter;
      return odgovaraTekst && odgovaraRezultat;
    });
  }

  klasaRezultata(r: RezultatZasejavanja): string {
    if (r === 'izraslo') return 'info';
    if (r === 'kontaminirano') return 'lose';
    if (r === 'u toku') return 'neutral';
    return 'ok'; // nije izraslo (za patogene je poželjno)
  }
}

import { Component, OnInit } from '@angular/core';

import { Uzorak, StatusUzorka, VrstaUzorka, STATUSI_UZORKA, VRSTE_UZORKA } from '../../../core/models';
import { UzorciService } from '../../../core/services/uzorci.service';

@Component({
  selector: 'app-uzorci-list',
  templateUrl: './uzorci-list.component.html',
  styleUrl: './uzorci-list.component.scss',
})
export class UzorciListComponent implements OnInit {
  private svi: Uzorak[] = [];
  prikazani: Uzorak[] = [];

  pretraga = '';
  statusFilter: StatusUzorka | 'svi' = 'svi';
  vrstaFilter: VrstaUzorka | 'sve' = 'sve';
  statusi = STATUSI_UZORKA;
  vrste = VRSTE_UZORKA;

  ucitavanje = true;
  kolone = ['sifra', 'naziv', 'vrsta', 'prijem', 'status'];

  constructor(private servis: UzorciService) {}

  ngOnInit(): void {
    this.servis.ucitajSve().subscribe((lista) => {
      this.svi = lista;
      this.prikazani = lista;
      this.ucitavanje = false;
    });
  }

  filtriraj(): void {
    const t = this.pretraga.trim().toLowerCase();
    this.prikazani = this.svi.filter((u) => {
      const odgovaraTekst =
        !t || u.naziv.toLowerCase().includes(t) || u.sifra.toLowerCase().includes(t) ||
        u.poreklo.toLowerCase().includes(t);
      const odgovaraStatus = this.statusFilter === 'svi' || u.status === this.statusFilter;
      const odgovaraVrsta = this.vrstaFilter === 'sve' || u.vrsta === this.vrstaFilter;
      return odgovaraTekst && odgovaraStatus && odgovaraVrsta;
    });
  }

  // Boja oznake prema statusu uzorka.
  klasaStatusa(status: StatusUzorka): string {
    if (status === 'završen') return 'ok';
    if (status === 'arhiviran') return 'neutral';
    return 'info';
  }
}

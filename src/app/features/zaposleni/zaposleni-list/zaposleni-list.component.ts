import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Zaposleni, Pozicija, POZICIJE } from '../../../core/models';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';

@Component({
  selector: 'app-zaposleni-list',
  templateUrl: './zaposleni-list.component.html',
  styleUrl: './zaposleni-list.component.scss',
})
export class ZaposleniListComponent implements OnInit {
  private svi: Zaposleni[] = [];
  prikazani: Zaposleni[] = [];
  laboratorije = new Map<string, string>(); // labId -> naziv

  pretraga = '';
  pozicijaFilter: Pozicija | 'sve' = 'sve';
  pozicije = POZICIJE;

  ucitavanje = true;
  kolone = ['ime', 'pozicija', 'laboratorija', 'status'];

  constructor(
    private zaposleniServis: ZaposleniService,
    private laboratorijeServis: LaboratorijeService
  ) {}

  ngOnInit(): void {
    forkJoin({
      zaposleni: this.zaposleniServis.ucitajSve(),
      labovi: this.laboratorijeServis.ucitajSve(),
    }).subscribe(({ zaposleni, labovi }) => {
      labovi.forEach((l) => this.laboratorije.set(l.id, l.naziv));
      this.svi = zaposleni;
      this.prikazani = zaposleni;
      this.ucitavanje = false;
    });
  }

  get imaAktivneFiltere(): boolean { return !!this.pretraga.trim() || this.pozicijaFilter !== 'sve'; }

  ocistiFiltere(): void {
    this.pretraga = '';
    this.pozicijaFilter = 'sve';
    this.filtriraj();
  }

  filtriraj(): void {
    const t = this.pretraga.trim().toLowerCase();
    this.prikazani = this.svi.filter((z) => {
      const punoIme = `${z.ime} ${z.prezime}`.toLowerCase();
      const odgovaraTekst = !t || punoIme.includes(t) || z.email.toLowerCase().includes(t);
      const odgovaraPozicija = this.pozicijaFilter === 'sve' || z.pozicija === this.pozicijaFilter;
      return odgovaraTekst && odgovaraPozicija;
    });
  }
}

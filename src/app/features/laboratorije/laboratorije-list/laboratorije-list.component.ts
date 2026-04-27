import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Laboratorija, Zaposleni } from '../../../core/models';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';

@Component({
  selector: 'app-laboratorije-list',
  templateUrl: './laboratorije-list.component.html',
  styleUrl: './laboratorije-list.component.scss',
})
export class LaboratorijeListComponent implements OnInit {
  laboratorije: Laboratorija[] = [];
  sefovi = new Map<string, string>(); // labId -> ime šefa
  ucitavanje = true;

  constructor(
    private laboratorijeServis: LaboratorijeService,
    private zaposleniServis: ZaposleniService
  ) {}

  ngOnInit(): void {
    forkJoin({
      labovi: this.laboratorijeServis.ucitajSve(),
      zaposleni: this.zaposleniServis.ucitajSve(),
    }).subscribe(({ labovi, zaposleni }) => {
      this.laboratorije = labovi;
      labovi.forEach((l) => {
        const sef = zaposleni.find((z: Zaposleni) => z.id === l.sefId);
        this.sefovi.set(l.id, sef ? `${sef.ime} ${sef.prezime}` : '—');
      });
      this.ucitavanje = false;
    });
  }
}

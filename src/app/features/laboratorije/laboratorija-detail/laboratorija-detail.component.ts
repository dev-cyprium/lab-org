import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Laboratorija, Zaposleni } from '../../../core/models';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';

@Component({
  selector: 'app-laboratorija-detail',
  templateUrl: './laboratorija-detail.component.html',
  styleUrl: './laboratorija-detail.component.scss',
})
export class LaboratorijaDetailComponent implements OnInit {
  laboratorija?: Laboratorija;
  sef?: Zaposleni;
  osoblje: Zaposleni[] = []; // svi zaposleni u ovoj laboratoriji
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private laboratorijeServis: LaboratorijeService,
    private zaposleniServis: ZaposleniService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      lab: this.laboratorijeServis.ucitajJedan(id),
      zaposleni: this.zaposleniServis.ucitajSve(),
    }).subscribe(({ lab, zaposleni }) => {
      this.laboratorija = lab;
      if (lab) {
        this.sef = zaposleni.find((z) => z.id === lab.sefId);
        this.osoblje = zaposleni.filter((z) => z.laboratorijaId === lab.id);
      }
      this.ucitavanje = false;
    });
  }
}

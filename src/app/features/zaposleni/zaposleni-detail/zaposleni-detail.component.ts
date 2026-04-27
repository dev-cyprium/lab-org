import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Zaposleni, Laboratorija } from '../../../core/models';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';

@Component({
  selector: 'app-zaposleni-detail',
  templateUrl: './zaposleni-detail.component.html',
  styleUrl: './zaposleni-detail.component.scss',
})
export class ZaposleniDetailComponent implements OnInit {
  zaposleni?: Zaposleni;
  laboratorija?: Laboratorija;
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private zaposleniServis: ZaposleniService,
    private laboratorijeServis: LaboratorijeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      z: this.zaposleniServis.ucitajJedan(id),
      labovi: this.laboratorijeServis.ucitajSve(),
    }).subscribe(({ z, labovi }) => {
      this.zaposleni = z;
      if (z) {
        this.laboratorija = labovi.find((l) => l.id === z.laboratorijaId);
      }
      this.ucitavanje = false;
    });
  }
}

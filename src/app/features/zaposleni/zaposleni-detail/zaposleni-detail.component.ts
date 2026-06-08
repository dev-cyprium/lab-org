import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { Zaposleni, Laboratorija } from '../../../core/models';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

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
    private router: Router,
    private dialog: MatDialog,
    private zaposleniServis: ZaposleniService,
    private laboratorijeServis: LaboratorijeService,
    private notifikacija: NotifikacijaService
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

  obrisi(): void {
    if (!this.zaposleni) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        naslov: 'Brisanje zaposlenog',
        poruka: `Da li sigurno želiš da obrišeš „${this.zaposleni.ime} ${this.zaposleni.prezime}“?`,
      },
    });
    ref.afterClosed().subscribe(async (potvrda) => {
      if (!potvrda || !this.zaposleni) {
        return;
      }
      try {
        await this.zaposleniServis.obrisi(this.zaposleni.id);
        this.notifikacija.uspeh('Zaposleni je obrisan.');
        this.router.navigate(['/zaposleni']);
      } catch {
        this.notifikacija.greska('Brisanje nije uspelo.');
      }
    });
  }
}

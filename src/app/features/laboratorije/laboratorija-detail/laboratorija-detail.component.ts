import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { Laboratorija, Zaposleni } from '../../../core/models';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

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
    private router: Router,
    private dialog: MatDialog,
    private laboratorijeServis: LaboratorijeService,
    private zaposleniServis: ZaposleniService,
    private notifikacija: NotifikacijaService
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

  obrisi(): void {
    if (!this.laboratorija) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        naslov: 'Brisanje laboratorije',
        poruka: `Da li sigurno želiš da obrišeš „${this.laboratorija.naziv}“?`,
      },
    });
    ref.afterClosed().subscribe(async (potvrda) => {
      if (!potvrda || !this.laboratorija) {
        return;
      }
      try {
        await this.laboratorijeServis.obrisi(this.laboratorija.id);
        this.notifikacija.uspeh('Laboratorija je obrisana.');
        this.router.navigate(['/laboratorije']);
      } catch {
        this.notifikacija.greska('Brisanje nije uspelo.');
      }
    });
  }
}

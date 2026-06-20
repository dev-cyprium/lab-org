import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { Analiza, Uzorak, Zaposleni } from '../../../core/models';
import { AnalizeService } from '../../../core/services/analize.service';
import { UzorciService } from '../../../core/services/uzorci.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-analiza-detail',
  templateUrl: './analiza-detail.component.html',
  styleUrl: './analiza-detail.component.scss',
})
export class AnalizaDetailComponent implements OnInit {
  analiza?: Analiza;
  uzorak?: Uzorak;
  analiticar?: Zaposleni;
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private analizeServis: AnalizeService,
    private uzorciServis: UzorciService,
    private zaposleniServis: ZaposleniService,
    private notifikacija: NotifikacijaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      analiza: this.analizeServis.ucitajJedan(id),
      uzorci: this.uzorciServis.ucitajSve(),
      zaposleni: this.zaposleniServis.ucitajSve(),
    }).subscribe(({ analiza, uzorci, zaposleni }) => {
      this.analiza = analiza;
      if (analiza) {
        this.uzorak = uzorci.find((u) => u.id === analiza.uzorakId);
        this.analiticar = zaposleni.find((z) => z.id === analiza.zaposleniId);
      }
      this.ucitavanje = false;
    });
  }

  obrisi(): void {
    if (!this.analiza) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        naslov: 'Brisanje analize',
        poruka: `Da li sigurno želiš da obrišeš analizu „${this.analiza.sifra}“?`,
      },
    });
    ref.afterClosed().subscribe(async (potvrda) => {
      if (!potvrda || !this.analiza) {
        return;
      }
      try {
        await this.analizeServis.obrisi(this.analiza.id);
        this.notifikacija.uspeh('Analiza je obrisana.');
        this.router.navigate(['/analize']);
      } catch {
        this.notifikacija.greska('Brisanje nije uspelo.');
      }
    });
  }
}

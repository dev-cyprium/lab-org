import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { Zasejavanje, Uzorak, Podloga, Mikroorganizam, RezultatZasejavanja } from '../../../core/models';
import { ZasejavanjaService } from '../../../core/services/zasejavanja.service';
import { UzorciService } from '../../../core/services/uzorci.service';
import { PodlogeService } from '../../../core/services/podloge.service';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-zasejavanje-detail',
  templateUrl: './zasejavanje-detail.component.html',
  styleUrl: './zasejavanje-detail.component.scss',
})
export class ZasejavanjeDetailComponent implements OnInit {
  zasejavanje?: Zasejavanje;
  uzorak?: Uzorak;
  podloga?: Podloga;
  mikroorganizam?: Mikroorganizam;
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private zasejavanjaServis: ZasejavanjaService,
    private uzorciServis: UzorciService,
    private podlogeServis: PodlogeService,
    private mikroorganizmiServis: MikroorganizmiService,
    private notifikacija: NotifikacijaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      zasejavanje: this.zasejavanjaServis.ucitajJedan(id),
      uzorci: this.uzorciServis.ucitajSve(),
      podloge: this.podlogeServis.ucitajSve(),
      mikroorganizmi: this.mikroorganizmiServis.ucitajSve(),
    }).subscribe((r) => {
      this.zasejavanje = r.zasejavanje;
      if (r.zasejavanje) {
        const z = r.zasejavanje;
        this.uzorak = r.uzorci.find((u) => u.id === z.uzorakId);
        this.podloga = r.podloge.find((p) => p.id === z.podlogaId);
        this.mikroorganizam = r.mikroorganizmi.find((m) => m.id === z.mikroorganizamId);
      }
      this.ucitavanje = false;
    });
  }

  klasaRezultata(rezultat: RezultatZasejavanja): string {
    if (rezultat === 'izraslo') return 'info';
    if (rezultat === 'kontaminirano') return 'lose';
    if (rezultat === 'u toku') return 'neutral';
    return 'ok';
  }

  obrisi(): void {
    if (!this.zasejavanje) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        naslov: 'Brisanje zasejavanja',
        poruka: `Da li sigurno želiš da obrišeš zasejavanje „${this.zasejavanje.oznaka}“?`,
      },
    });
    ref.afterClosed().subscribe(async (potvrda) => {
      if (!potvrda || !this.zasejavanje) {
        return;
      }
      try {
        await this.zasejavanjaServis.obrisi(this.zasejavanje.id);
        this.notifikacija.uspeh('Zasejavanje je obrisano.');
        this.router.navigate(['/zasejavanja']);
      } catch {
        this.notifikacija.greska('Brisanje nije uspelo.');
      }
    });
  }
}

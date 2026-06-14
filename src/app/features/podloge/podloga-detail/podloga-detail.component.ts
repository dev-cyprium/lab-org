import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Podloga } from '../../../core/models';
import { PodlogeService } from '../../../core/services/podloge.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-podloga-detail',
  templateUrl: './podloga-detail.component.html',
  styleUrl: './podloga-detail.component.scss',
})
export class PodlogaDetailComponent implements OnInit {
  podloga?: Podloga;
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private servis: PodlogeService,
    private notifikacija: NotifikacijaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.servis.ucitajJedan(id).subscribe((p) => {
      this.podloga = p;
      this.ucitavanje = false;
    });
  }

  obrisi(): void {
    if (!this.podloga) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        naslov: 'Brisanje podloge',
        poruka: `Da li sigurno želiš da obrišeš „${this.podloga.naziv}“?`,
      },
    });
    ref.afterClosed().subscribe(async (potvrda) => {
      if (!potvrda || !this.podloga) {
        return;
      }
      try {
        await this.servis.obrisi(this.podloga.id);
        this.notifikacija.uspeh('Podloga je obrisana.');
        this.router.navigate(['/podloge']);
      } catch {
        this.notifikacija.greska('Brisanje nije uspelo.');
      }
    });
  }
}

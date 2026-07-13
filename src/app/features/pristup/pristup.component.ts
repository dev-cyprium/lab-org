import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { NotifikacijaService } from '../../core/services/notifikacija.service';
import { OrgDialogComponent } from '../../shared/components/org-dialog/org-dialog.component';

// Ekran za korisnika koji još nema firmu — vidi zahteve na čekanju,
// može da se pridruži preko koda ili da napravi svoju firmu.
@Component({
  selector: 'app-pristup',
  templateUrl: './pristup.component.html',
  styleUrl: './pristup.component.scss',
})
export class PristupComponent implements OnInit, OnDestroy {
  mojiZahtevi$ = this.auth.mojiZahtevi$;
  private sub?: Subscription;

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  ngOnInit(): void {
    // Čim korisnik dobije članstvo (admin odobri), automatski ga vodimo unutra.
    this.sub = this.auth.mojeKompanije$.subscribe((firme) => {
      if (firme.length) this.router.navigate(['/pocetna']);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  otvoriDijalog(): void {
    const ref = this.dialog.open(OrgDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe((rezultat) => {
      if (!rezultat) return;
      if (rezultat.tip === 'firma') {
        this.notifikacija.uspeh('Firma je spremna.');
        this.router.navigate(['/pocetna']);
      } else {
        this.notifikacija.uspeh('Zahtev je poslat — čeka odobrenje.');
      }
    });
  }

  async odjava(): Promise<void> {
    await this.auth.odjava();
    this.router.navigate(['/prijava']);
  }
}

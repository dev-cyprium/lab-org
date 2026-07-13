import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { NotifikacijaService } from '../../services/notifikacija.service';
import { OrgDialogComponent } from '../../../shared/components/org-dialog/org-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  korisnik$ = this.auth.korisnik$;
  aktivnaKompanija$ = this.auth.aktivnaKompanija$;
  mojeKompanije$ = this.auth.mojeKompanije$;
  brojZahteva$ = this.auth.zahteviZaMojeFirme$.pipe(map((z) => z.length));

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private notifikacija: NotifikacijaService
  ) {}

  async promeni(kompanijaId: string): Promise<void> {
    await this.auth.promeniKompaniju(kompanijaId);
    this.notifikacija.uspeh('Firma je promenjena.');
    this.reloadPocetna();
  }

  otvoriDijalog(): void {
    const ref = this.dialog.open(OrgDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe((rezultat) => {
      if (!rezultat) return;
      if (rezultat.tip === 'firma') {
        this.notifikacija.uspeh('Firma je spremna.');
        this.reloadPocetna();
      } else {
        this.notifikacija.uspeh('Zahtev je poslat — čeka odobrenje.');
      }
    });
  }

  async odjava(): Promise<void> {
    await this.auth.odjava();
    this.notifikacija.uspeh('Odjavljeni ste.');
    this.router.navigate(['/prijava']);
  }

  // Reload preko dashboard-a da se podaci povuku za novu aktivnu firmu.
  private reloadPocetna(): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/pocetna']));
  }
}

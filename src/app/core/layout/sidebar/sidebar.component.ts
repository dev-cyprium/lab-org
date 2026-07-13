import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { OrgDialogComponent } from '../../../shared/components/org-dialog/org-dialog.component';
import { AuthService } from '../../services/auth.service';
import { NotifikacijaService } from '../../services/notifikacija.service';

interface MeniStavka {
  putanja: string;
  naziv: string;
  ikonica: string;
}

interface MeniGrupa {
  naziv: string;
  stavke: MeniStavka[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Output() navigated = new EventEmitter<void>();

  korisnik$ = this.auth.korisnik$;
  aktivnaKompanija$ = this.auth.aktivnaKompanija$;
  mojeKompanije$ = this.auth.mojeKompanije$;

  meniGrupe: MeniGrupa[] = [
    {
      naziv: 'Pregled',
      stavke: [{ putanja: '/pocetna', naziv: 'Kontrolni centar', ikonica: 'space_dashboard' }],
    },
    {
      naziv: 'Radni proces',
      stavke: [
        { putanja: '/uzorci', naziv: 'Uzorci', ikonica: 'science' },
        { putanja: '/zasejavanja', naziv: 'Zasejavanja', ikonica: 'grain' },
        { putanja: '/analize', naziv: 'Analize', ikonica: 'fact_check' },
      ],
    },
    {
      naziv: 'Laboratorijski resursi',
      stavke: [
        { putanja: '/podloge', naziv: 'Podloge i reagensi', ikonica: 'water_drop' },
        { putanja: '/mikroorganizmi', naziv: 'Mikroorganizmi', ikonica: 'coronavirus' },
      ],
    },
    {
      naziv: 'Organizacija',
      stavke: [
        { putanja: '/laboratorije', naziv: 'Laboratorije', ikonica: 'apartment' },
        { putanja: '/zaposleni', naziv: 'Zaposleni', ikonica: 'badge' },
      ],
    },
  ];

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
    const ref = this.dialog.open(OrgDialogComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
    });
    ref.afterClosed().subscribe((rezultat) => {
      if (!rezultat) return;
      this.notifikacija.uspeh(
        rezultat.tip === 'firma' ? 'Firma je spremna.' : 'Zahtev je poslat — čeka odobrenje.'
      );
      if (rezultat.tip === 'firma') this.reloadPocetna();
    });
  }

  async odjava(): Promise<void> {
    await this.auth.odjava();
    this.notifikacija.uspeh('Odjavljeni ste.');
    this.router.navigate(['/prijava']);
  }

  private reloadPocetna(): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/pocetna']));
  }
}

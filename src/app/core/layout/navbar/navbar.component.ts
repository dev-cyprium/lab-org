import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  korisnik$ = this.auth.korisnik$;
  brojZahteva$ = this.auth.zahteviZaMojeFirme$.pipe(map((z) => z.length));
  naslovStranice$ = this.router.events.pipe(
    filter((dogadjaj): dogadjaj is NavigationEnd => dogadjaj instanceof NavigationEnd),
    startWith(null),
    map(() => this.naslovZaPutanju(this.router.url))
  );

  constructor(private auth: AuthService, private router: Router) {}

  private naslovZaPutanju(putanja: string): string {
    const koren = putanja.split('?')[0].split('/')[1] ?? '';
    const naslovi: Record<string, string> = {
      pocetna: 'Kontrolni centar',
      uzorci: 'Uzorci',
      zasejavanja: 'Zasejavanja',
      analize: 'Analize',
      podloge: 'Podloge i reagensi',
      mikroorganizmi: 'Mikroorganizmi',
      laboratorije: 'Laboratorije',
      zaposleni: 'Zaposleni',
      zahtevi: 'Zahtevi za pristup',
      pristup: 'Pristup firmi',
      dobrodosli: 'Početak rada',
    };
    return naslovi[koren] ?? 'LabOrg';
  }
}

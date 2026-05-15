import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NotifikacijaService } from '../../services/notifikacija.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // Roditelj (AppComponent) hvata ovaj event da otvori/zatvori bočni meni.
  @Output() toggleSidenav = new EventEmitter<void>();

  korisnik$ = this.auth.korisnik$;
  kompanija$ = this.auth.aktivnaKompanija$;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  async odjava(): Promise<void> {
    await this.auth.odjava();
    this.notifikacija.uspeh('Odjavljeni ste.');
    this.router.navigate(['/prijava']);
  }
}

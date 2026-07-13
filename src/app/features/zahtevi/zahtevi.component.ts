import { Component } from '@angular/core';

import { ZahtevZaPristup } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { NotifikacijaService } from '../../core/services/notifikacija.service';

// Administrator vidi zahteve za pristup svojim firmama i odobrava/odbija ih.
@Component({
  selector: 'app-zahtevi',
  templateUrl: './zahtevi.component.html',
  styleUrl: './zahtevi.component.scss',
})
export class ZahteviComponent {
  zahtevi$ = this.auth.zahteviZaMojeFirme$;
  obrada = '';

  constructor(private auth: AuthService, private notifikacija: NotifikacijaService) {}

  async odobri(z: ZahtevZaPristup): Promise<void> {
    this.obrada = z.id;
    try {
      await this.auth.odobri(z);
      this.notifikacija.uspeh(`${z.ime || z.email} je dodat u „${z.kompanijaNaziv}“.`);
    } catch {
      this.notifikacija.greska('Odobravanje nije uspelo.');
    } finally {
      this.obrada = '';
    }
  }

  async odbij(z: ZahtevZaPristup): Promise<void> {
    this.obrada = z.id;
    try {
      await this.auth.odbij(z);
      this.notifikacija.uspeh('Zahtev je odbijen.');
    } catch {
      this.notifikacija.greska('Odbijanje nije uspelo.');
    } finally {
      this.obrada = '';
    }
  }
}

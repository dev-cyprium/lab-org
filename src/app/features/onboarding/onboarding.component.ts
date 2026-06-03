import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TipLaboratorije, TIPOVI_LABORATORIJE } from '../../core/models';
import { LaboratorijeService } from '../../core/services/laboratorije.service';
import { SeedService } from '../../core/services/seed.service';
import { AuthService } from '../../core/services/auth.service';
import { NotifikacijaService } from '../../core/services/notifikacija.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  tipovi: TipLaboratorije[] = TIPOVI_LABORATORIJE;
  jeAdmin = this.auth.jeAdmin;
  slanje = false;

  forma = this.fb.group({
    naziv: ['', Validators.required],
    tip: ['mikrobiološka' as TipLaboratorije, Validators.required],
    lokacija: ['', Validators.required],
    kontakt: [''],
    opis: [''],
  });

  constructor(
    private fb: FormBuilder,
    private laboratorijeServis: LaboratorijeService,
    private seedServis: SeedService,
    private auth: AuthService,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  async kreirajLaboratoriju(): Promise<void> {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.slanje = true;
    const v = this.forma.value;
    try {
      await this.laboratorijeServis.dodaj({
        naziv: v.naziv!,
        tip: v.tip!,
        lokacija: v.lokacija!,
        kontakt: v.kontakt ?? '',
        sefId: '',
        opis: v.opis ?? '',
      });
      this.notifikacija.uspeh('Laboratorija je kreirana.');
      this.router.navigate(['/pocetna']);
    } catch {
      this.notifikacija.greska('Kreiranje nije uspelo.');
      this.slanje = false;
    }
  }

  async uveziDemo(): Promise<void> {
    this.slanje = true;
    try {
      await this.seedServis.uveziDemoPodatke();
      this.notifikacija.uspeh('Demo podaci su uvezeni.');
      this.router.navigate(['/pocetna']);
    } catch {
      this.notifikacija.greska('Uvoz demo podataka nije uspeo.');
      this.slanje = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Kompanija } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { KompanijeService } from '../../../core/services/kompanije.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  forma = this.fb.group({
    ime: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    lozinka: ['', [Validators.required, Validators.minLength(6)]],
    nacin: ['nova', Validators.required],
    // polja za novu kompaniju
    nazivKompanije: ['', Validators.required],
    pib: [''],
    adresa: [''],
    kontakt: [''],
    // za pridruživanje postojećoj
    kompanijaId: [''],
  });

  kompanije$!: Observable<Kompanija[]>;
  slanje = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private kompanijeServis: KompanijeService,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  ngOnInit(): void {
    this.kompanije$ = this.kompanijeServis.ucitajSve();
    // Validatori se menjaju u zavisnosti od načina registracije.
    this.forma.get('nacin')!.valueChanges.subscribe((nacin) => this.podesiValidatore(nacin));
  }

  get nova(): boolean {
    return this.forma.get('nacin')!.value === 'nova';
  }

  private podesiValidatore(nacin: string | null): void {
    const naziv = this.forma.get('nazivKompanije')!;
    const kompanija = this.forma.get('kompanijaId')!;
    if (nacin === 'nova') {
      naziv.setValidators(Validators.required);
      kompanija.clearValidators();
    } else {
      kompanija.setValidators(Validators.required);
      naziv.clearValidators();
    }
    naziv.updateValueAndValidity();
    kompanija.updateValueAndValidity();
  }

  async registruj(): Promise<void> {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.slanje = true;
    const v = this.forma.value;
    try {
      await this.auth.registruj({
        email: v.email!,
        lozinka: v.lozinka!,
        ime: v.ime!,
        nacin: v.nacin as 'nova' | 'postojeca',
        nazivKompanije: v.nazivKompanije ?? undefined,
        pib: v.pib ?? undefined,
        adresa: v.adresa ?? undefined,
        kontakt: v.kontakt ?? undefined,
        kompanijaId: v.kompanijaId ?? undefined,
      });
      this.notifikacija.uspeh('Nalog je kreiran.');
      this.router.navigate(['/pocetna']);
    } catch (e: any) {
      const poruka =
        e?.code === 'auth/email-already-in-use'
          ? 'Već postoji nalog sa ovim email-om.'
          : 'Registracija nije uspela. Pokušaj ponovo.';
      this.notifikacija.greska(poruka);
      this.slanje = false;
    }
  }
}

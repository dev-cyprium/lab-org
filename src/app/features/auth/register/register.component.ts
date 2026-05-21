import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Kompanija } from '../../../core/models';
import { AuthService, RegistracijaPodaci } from '../../../core/services/auth.service';
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

  // Google režim: identitet dolazi sa Google naloga, bira se samo firma.
  googleMode = false;
  googleIme = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private kompanijeServis: KompanijeService,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  ngOnInit(): void {
    this.kompanije$ = this.kompanijeServis.ucitajSve();
    this.forma.get('nacin')!.valueChanges.subscribe((nacin) => this.podesiValidatore(nacin));

    // Ako je korisnik već prijavljen preko Google-a (stigao sa login stranice), samo bira firmu.
    if (this.auth.imaAuthNalog) {
      this.aktivirajGoogleRezim();
    }
  }

  get nova(): boolean {
    return this.forma.get('nacin')!.value === 'nova';
  }

  async nastaviGoogle(): Promise<void> {
    this.slanje = true;
    try {
      const imaProfil = await this.auth.prijavaGoogle();
      if (imaProfil) {
        this.router.navigate(['/pocetna']);
        return;
      }
      this.aktivirajGoogleRezim();
      this.slanje = false;
    } catch {
      this.notifikacija.greska('Google prijava nije uspela.');
      this.slanje = false;
    }
  }

  async registruj(): Promise<void> {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.slanje = true;
    const v = this.forma.value;
    const podaci: RegistracijaPodaci = {
      email: v.email ?? '',
      lozinka: v.lozinka ?? '',
      ime: v.ime ?? this.googleIme,
      nacin: v.nacin as 'nova' | 'postojeca',
      nazivKompanije: v.nazivKompanije ?? undefined,
      pib: v.pib ?? undefined,
      adresa: v.adresa ?? undefined,
      kontakt: v.kontakt ?? undefined,
      kompanijaId: v.kompanijaId ?? undefined,
    };

    try {
      if (this.googleMode) {
        await this.auth.dovrsiGoogleProfil(podaci);
      } else {
        await this.auth.registruj(podaci);
      }
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

  private aktivirajGoogleRezim(): void {
    this.googleMode = true;
    this.googleIme = this.auth.googleIme ?? '';
    // Lični podaci dolaze sa Google naloga — skidamo validatore sa tih polja.
    ['ime', 'email', 'lozinka'].forEach((polje) => {
      const kontrola = this.forma.get(polje)!;
      kontrola.clearValidators();
      kontrola.updateValueAndValidity();
    });
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
}

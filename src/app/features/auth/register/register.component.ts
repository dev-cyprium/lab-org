import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, RegistracijaPodaci } from '../../../core/services/auth.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { SeedService } from '../../../core/services/seed.service';

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
    // kod za pridruživanje postojećoj firmi
    kod: [''],
  });

  slanje = false;

  // Google režim: identitet dolazi sa Google naloga, bira se samo firma.
  googleMode = false;
  googleIme = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notifikacija: NotifikacijaService,
    private seed: SeedService
  ) {}

  ngOnInit(): void {
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
      nacin: v.nacin as 'nova' | 'postojeca' | 'demo',
      nazivKompanije: v.nazivKompanije ?? undefined,
      pib: v.pib ?? undefined,
      adresa: v.adresa ?? undefined,
      kontakt: v.kontakt ?? undefined,
      kod: v.kod ?? undefined,
    };

    try {
      const firmaId = this.googleMode
        ? await this.auth.dovrsiGoogleProfil(podaci)
        : await this.auth.registruj(podaci);
      if (podaci.nacin === 'demo') {
        await this.seed.uveziDemoPodatke(firmaId ?? undefined);
        this.notifikacija.uspeh('Demo firma je spremna — istraži aplikaciju.');
        this.router.navigate(['/pocetna']);
      } else if (podaci.nacin === 'nova') {
        this.notifikacija.uspeh('Firma je kreirana.');
        this.router.navigate(['/pocetna']);
      } else {
        this.notifikacija.uspeh('Zahtev je poslat — čeka odobrenje.');
        this.router.navigate(['/pristup']);
      }
    } catch (e: any) {
      this.notifikacija.greska(this.poruka(e));
      this.slanje = false;
    }
  }

  private poruka(e: any): string {
    if (e?.message === 'KOD_NE_POSTOJI') return 'Firma sa tim kodom ne postoji.';
    if (e?.message === 'VEC_CLAN') return 'Već si član te firme.';
    if (e?.code === 'auth/email-already-in-use') return 'Već postoji nalog sa ovim email-om.';
    return 'Registracija nije uspela. Pokušaj ponovo.';
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
    const kod = this.forma.get('kod')!;
    naziv.clearValidators();
    kod.clearValidators();
    if (nacin === 'nova') naziv.setValidators(Validators.required);
    else if (nacin === 'postojeca') kod.setValidators(Validators.required);
    naziv.updateValueAndValidity();
    kod.updateValueAndValidity();
  }
}

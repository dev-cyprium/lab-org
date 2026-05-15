import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  forma = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    lozinka: ['', [Validators.required, Validators.minLength(6)]],
  });

  slanje = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  async prijavi(): Promise<void> {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.slanje = true;
    const { email, lozinka } = this.forma.value;
    try {
      await this.auth.prijava(email!, lozinka!);
      this.notifikacija.uspeh('Uspešno ste prijavljeni.');
      this.router.navigate(['/pocetna']);
    } catch {
      // Firebase vraća generičku grešku — ne otkrivamo da li je u pitanju email ili lozinka.
      this.notifikacija.greska('Pogrešan email ili lozinka.');
      this.slanje = false;
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AuthService } from '../../../core/services/auth.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { SeedService } from '../../../core/services/seed.service';

// Rezultat dijaloga: da li je napravljena firma ili poslat zahtev za pridruživanje.
export type OrgRezultat = { tip: 'firma' } | { tip: 'zahtev' };

@Component({
  selector: 'app-org-dialog',
  templateUrl: './org-dialog.component.html',
  styleUrl: './org-dialog.component.scss',
})
export class OrgDialogComponent {
  forma = this.fb.group({
    nacin: ['nova', Validators.required],
    naziv: ['', Validators.required],
    pib: [''],
    adresa: [''],
    kontakt: [''],
    kod: [''],
  });

  slanje = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private dialogRef: MatDialogRef<OrgDialogComponent, OrgRezultat>,
    private notifikacija: NotifikacijaService,
    private seed: SeedService
  ) {
    this.forma.get('nacin')!.valueChanges.subscribe((n) => this.podesiValidatore(n));
  }

  get nacin(): string {
    return this.forma.get('nacin')!.value ?? 'nova';
  }

  get nova(): boolean {
    return this.nacin === 'nova';
  }

  async sacuvaj(): Promise<void> {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.slanje = true;
    const v = this.forma.value;
    try {
      if (this.nacin === 'nova') {
        await this.auth.napraviKompaniju({
          naziv: v.naziv!,
          pib: v.pib ?? '',
          adresa: v.adresa ?? '',
          kontakt: v.kontakt ?? '',
        });
        this.dialogRef.close({ tip: 'firma' });
      } else if (this.nacin === 'demo') {
        const id = await this.auth.napraviKompaniju({ naziv: 'Demo firma' });
        await this.seed.uveziDemoPodatke(id);
        this.dialogRef.close({ tip: 'firma' });
      } else {
        await this.auth.posaljiZahtev(v.kod ?? '');
        this.dialogRef.close({ tip: 'zahtev' });
      }
    } catch (e: any) {
      this.notifikacija.greska(this.poruka(e));
      this.slanje = false;
    }
  }

  private poruka(e: any): string {
    if (e?.message === 'KOD_NE_POSTOJI') return 'Firma sa tim kodom ne postoji.';
    if (e?.message === 'VEC_CLAN') return 'Već si član te firme.';
    return 'Akcija nije uspela.';
  }

  private podesiValidatore(nacin: string | null): void {
    const naziv = this.forma.get('naziv')!;
    const kod = this.forma.get('kod')!;
    naziv.clearValidators();
    kod.clearValidators();
    if (nacin === 'nova') naziv.setValidators(Validators.required);
    else if (nacin === 'postojeca') kod.setValidators(Validators.required);
    naziv.updateValueAndValidity();
    kod.updateValueAndValidity();
  }
}

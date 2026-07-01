import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Kompanija } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { KompanijeService } from '../../../core/services/kompanije.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';

@Component({
  selector: 'app-org-dialog',
  templateUrl: './org-dialog.component.html',
  styleUrl: './org-dialog.component.scss',
})
export class OrgDialogComponent implements OnInit {
  forma = this.fb.group({
    nacin: ['nova', Validators.required],
    naziv: ['', Validators.required],
    pib: [''],
    adresa: [''],
    kontakt: [''],
    kompanijaId: [''],
  });

  dostupne: Kompanija[] = []; // firme kojima korisnik još ne pripada
  slanje = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private kompanijeServis: KompanijeService,
    private dialogRef: MatDialogRef<OrgDialogComponent>,
    private notifikacija: NotifikacijaService
  ) {}

  get nova(): boolean {
    return this.forma.get('nacin')!.value === 'nova';
  }

  ngOnInit(): void {
    this.kompanijeServis.ucitajSve().subscribe((sve) => {
      const moje = this.auth.mojiKompanijeIds;
      this.dostupne = sve.filter((c) => !moje.includes(c.id));
    });
    this.forma.get('nacin')!.valueChanges.subscribe((n) => this.podesiValidatore(n));
  }

  async sacuvaj(): Promise<void> {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.slanje = true;
    const v = this.forma.value;
    try {
      if (this.nova) {
        await this.auth.napraviKompaniju({
          naziv: v.naziv!,
          pib: v.pib ?? '',
          adresa: v.adresa ?? '',
          kontakt: v.kontakt ?? '',
        });
      } else {
        await this.auth.pridruziSe(v.kompanijaId!);
      }
      this.dialogRef.close(true);
    } catch {
      this.notifikacija.greska('Akcija nije uspela.');
      this.slanje = false;
    }
  }

  private podesiValidatore(nacin: string | null): void {
    const naziv = this.forma.get('naziv')!;
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

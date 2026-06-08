import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Pozicija, POZICIJE, Laboratorija } from '../../../core/models';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';

@Component({
  selector: 'app-zaposleni-form',
  templateUrl: './zaposleni-form.component.html',
  styleUrl: './zaposleni-form.component.scss',
})
export class ZaposleniFormComponent implements OnInit {
  forma = this.fb.group({
    ime: ['', Validators.required],
    prezime: ['', Validators.required],
    pozicija: ['laborant' as Pozicija, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefon: [''],
    strucnaSprema: [''],
    laboratorijaId: ['', Validators.required],
    datumZaposlenja: ['', Validators.required],
    aktivan: [true],
  });

  pozicije: Pozicija[] = POZICIJE;
  laboratorije: Laboratorija[] = [];
  id: string | null = null;
  ucitavanje = false;
  slanje = false;

  constructor(
    private fb: FormBuilder,
    private servis: ZaposleniService,
    private laboratorijeServis: LaboratorijeService,
    private route: ActivatedRoute,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  get uredjivanje(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.laboratorijeServis.ucitajSve().subscribe((l) => (this.laboratorije = l));

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.ucitavanje = true;
      this.servis.ucitajJedan(this.id).subscribe((z) => {
        if (z) {
          this.forma.patchValue(z);
        }
        this.ucitavanje = false;
      });
    }
  }

  async sacuvaj(): Promise<void> {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.slanje = true;
    const v = this.forma.value;
    const podaci = {
      ime: v.ime!,
      prezime: v.prezime!,
      pozicija: v.pozicija!,
      email: v.email!,
      telefon: v.telefon ?? '',
      strucnaSprema: v.strucnaSprema ?? '',
      laboratorijaId: v.laboratorijaId!,
      datumZaposlenja: v.datumZaposlenja!,
      aktivan: v.aktivan ?? true,
    };

    try {
      if (this.id) {
        await this.servis.izmeni(this.id, podaci);
        this.notifikacija.uspeh('Izmene su sačuvane.');
      } else {
        await this.servis.dodaj(podaci);
        this.notifikacija.uspeh('Zaposleni je dodat.');
      }
      this.router.navigate(['/zaposleni']);
    } catch {
      this.notifikacija.greska('Čuvanje nije uspelo.');
      this.slanje = false;
    }
  }
}

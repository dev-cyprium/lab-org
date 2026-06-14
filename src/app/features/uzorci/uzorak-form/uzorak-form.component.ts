import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  VrstaUzorka,
  StatusUzorka,
  VRSTE_UZORKA,
  STATUSI_UZORKA,
  Zaposleni,
  Laboratorija,
} from '../../../core/models';
import { UzorciService } from '../../../core/services/uzorci.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';

@Component({
  selector: 'app-uzorak-form',
  templateUrl: './uzorak-form.component.html',
  styleUrl: './uzorak-form.component.scss',
})
export class UzorakFormComponent implements OnInit {
  forma = this.fb.group({
    sifra: ['', Validators.required],
    vrsta: ['namirnica' as VrstaUzorka, Validators.required],
    naziv: ['', Validators.required],
    poreklo: [''],
    uzorkovacId: ['', Validators.required],
    laboratorijaId: ['', Validators.required],
    datumUzorkovanja: ['', Validators.required],
    datumPrijema: ['', Validators.required],
    kolicina: [0, [Validators.required, Validators.min(0)]],
    jedinica: ['g', Validators.required],
    temperaturaPrijema: [4],
    lokacijaUzorkovanja: [''],
    status: ['primljen' as StatusUzorka, Validators.required],
  });

  vrste: VrstaUzorka[] = VRSTE_UZORKA;
  statusi: StatusUzorka[] = STATUSI_UZORKA;
  zaposleni: Zaposleni[] = [];
  laboratorije: Laboratorija[] = [];
  id: string | null = null;
  ucitavanje = false;
  slanje = false;

  constructor(
    private fb: FormBuilder,
    private servis: UzorciService,
    private zaposleniServis: ZaposleniService,
    private laboratorijeServis: LaboratorijeService,
    private route: ActivatedRoute,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  get uredjivanje(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.zaposleniServis.ucitajSve().subscribe((z) => (this.zaposleni = z));
    this.laboratorijeServis.ucitajSve().subscribe((l) => (this.laboratorije = l));

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.ucitavanje = true;
      this.servis.ucitajJedan(this.id).subscribe((u) => {
        if (u) {
          this.forma.patchValue(u);
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
      sifra: v.sifra!,
      vrsta: v.vrsta!,
      naziv: v.naziv!,
      poreklo: v.poreklo ?? '',
      uzorkovacId: v.uzorkovacId!,
      laboratorijaId: v.laboratorijaId!,
      datumUzorkovanja: v.datumUzorkovanja!,
      datumPrijema: v.datumPrijema!,
      kolicina: v.kolicina ?? 0,
      jedinica: v.jedinica!,
      temperaturaPrijema: v.temperaturaPrijema ?? 0,
      lokacijaUzorkovanja: v.lokacijaUzorkovanja ?? '',
      status: v.status!,
    };

    try {
      if (this.id) {
        await this.servis.izmeni(this.id, podaci);
        this.notifikacija.uspeh('Izmene su sačuvane.');
      } else {
        await this.servis.dodaj(podaci);
        this.notifikacija.uspeh('Uzorak je dodat.');
      }
      this.router.navigate(['/uzorci']);
    } catch {
      this.notifikacija.greska('Čuvanje nije uspelo.');
      this.slanje = false;
    }
  }
}

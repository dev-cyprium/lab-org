import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TipAnalize, StavkaAnalize, Uzorak, Zaposleni, Mikroorganizam } from '../../../core/models';
import { AnalizeService } from '../../../core/services/analize.service';
import { UzorciService } from '../../../core/services/uzorci.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { danasIsoDatum } from '../../../shared/utils/datum';

@Component({
  selector: 'app-analiza-form',
  templateUrl: './analiza-form.component.html',
  styleUrl: './analiza-form.component.scss',
})
export class AnalizaFormComponent implements OnInit {
  forma = this.fb.group({
    sifra: ['', Validators.required],
    uzorakId: ['', Validators.required],
    zaposleniId: ['', Validators.required],
    tip: ['mikrobiološka' as TipAnalize, Validators.required],
    metoda: ['', Validators.required],
    datumAnalize: ['', Validators.required],
    stavke: this.fb.array([]),
  });

  tipovi: TipAnalize[] = ['mikrobiološka', 'hemijska'];
  uzorci: Uzorak[] = [];
  zaposleni: Zaposleni[] = [];
  mikroorganizmi: Mikroorganizam[] = [];
  id: string | null = null;
  ucitavanje = false;
  slanje = false;

  constructor(
    private fb: FormBuilder,
    private servis: AnalizeService,
    private uzorciServis: UzorciService,
    private zaposleniServis: ZaposleniService,
    private mikroorganizmiServis: MikroorganizmiService,
    private route: ActivatedRoute,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  get uredjivanje(): boolean {
    return !!this.id;
  }

  get stavke(): FormArray {
    return this.forma.get('stavke') as FormArray;
  }

  ngOnInit(): void {
    const uzorakId = this.route.snapshot.queryParamMap.get('uzorakId');
    if (uzorakId) this.forma.patchValue({ uzorakId });
    this.uzorciServis.ucitajSve().subscribe((u) => (this.uzorci = u));
    this.zaposleniServis.ucitajSve().subscribe((z) => (this.zaposleni = z));
    this.mikroorganizmiServis.ucitajSve().subscribe((m) => (this.mikroorganizmi = m));

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.ucitavanje = true;
      this.servis.ucitajJedan(this.id).subscribe((a) => {
        if (a) {
          this.forma.patchValue(a);
          a.stavke.forEach((s) => this.stavke.push(this.napraviStavku(s)));
        }
        this.ucitavanje = false;
      });
    } else {
      this.forma.patchValue({ datumAnalize: danasIsoDatum() });
      this.dodajStavku(); // nova analiza kreće sa jednom praznom stavkom
    }
  }

  postaviDanas(): void {
    this.forma.controls.datumAnalize.setValue(danasIsoDatum());
  }

  napraviStavku(s?: StavkaAnalize): FormGroup {
    return this.fb.group({
      parametar: [s?.parametar ?? '', Validators.required],
      mikroorganizamId: [s?.mikroorganizamId ?? ''],
      vrednost: [s?.vrednost ?? '', Validators.required],
      jedinica: [s?.jedinica ?? ''],
      granica: [s?.granica ?? '', Validators.required],
      status: [s?.status ?? 'ispravan', Validators.required],
    });
  }

  dodajStavku(): void {
    this.stavke.push(this.napraviStavku());
  }

  ukloniStavku(i: number): void {
    this.stavke.removeAt(i);
  }

  async sacuvaj(): Promise<void> {
    if (this.forma.invalid || this.stavke.length === 0) {
      this.forma.markAllAsTouched();
      if (this.stavke.length === 0) {
        this.notifikacija.greska('Dodaj bar jedan parametar.');
      }
      return;
    }
    this.slanje = true;
    const v = this.forma.value;

    // Vrednost koja je broj čuvamo kao broj (radi pipe-a), tekst ostaje tekst.
    const stavke: StavkaAnalize[] = this.stavke.controls.map((c) => {
      const sv = c.value;
      const broj = Number(sv.vrednost);
      return {
        parametar: sv.parametar,
        mikroorganizamId: sv.mikroorganizamId || undefined,
        vrednost: sv.vrednost !== '' && !isNaN(broj) ? broj : sv.vrednost,
        jedinica: sv.jedinica ?? '',
        granica: sv.granica ?? '',
        status: sv.status,
      };
    });

    // Ukupna ocena: dovoljna je jedna neispravna stavka za NEISPRAVAN.
    const zakljucak = stavke.some((s) => s.status === 'neispravan') ? 'NEISPRAVAN' : 'ISPRAVAN';

    const podaci = {
      sifra: v.sifra!,
      uzorakId: v.uzorakId!,
      zaposleniId: v.zaposleniId!,
      tip: v.tip!,
      metoda: v.metoda!,
      datumAnalize: v.datumAnalize!,
      stavke,
      zakljucak: zakljucak as 'ISPRAVAN' | 'NEISPRAVAN',
    };

    try {
      if (this.id) {
        await this.servis.izmeni(this.id, podaci);
        this.notifikacija.uspeh('Izmene su sačuvane.');
      } else {
        await this.servis.dodaj(podaci);
        this.notifikacija.uspeh('Analiza je dodata.');
      }
      this.router.navigate(['/analize']);
    } catch {
      this.notifikacija.greska('Čuvanje nije uspelo.');
      this.slanje = false;
    }
  }
}

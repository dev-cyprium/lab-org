import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TipLaboratorije, TIPOVI_LABORATORIJE, Zaposleni } from '../../../core/models';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';

@Component({
  selector: 'app-laboratorija-form',
  templateUrl: './laboratorija-form.component.html',
  styleUrl: './laboratorija-form.component.scss',
})
export class LaboratorijaFormComponent implements OnInit {
  forma = this.fb.group({
    naziv: ['', Validators.required],
    tip: ['mikrobiološka' as TipLaboratorije, Validators.required],
    lokacija: ['', Validators.required],
    kontakt: [''],
    sefId: [''],
    opis: [''],
  });

  tipovi: TipLaboratorije[] = TIPOVI_LABORATORIJE;
  zaposleni: Zaposleni[] = [];
  id: string | null = null;
  ucitavanje = false;
  slanje = false;

  constructor(
    private fb: FormBuilder,
    private servis: LaboratorijeService,
    private zaposleniServis: ZaposleniService,
    private route: ActivatedRoute,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  get uredjivanje(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.zaposleniServis.ucitajSve().subscribe((z) => (this.zaposleni = z));

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.ucitavanje = true;
      this.servis.ucitajJedan(this.id).subscribe((lab) => {
        if (lab) {
          this.forma.patchValue(lab);
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
      naziv: v.naziv!,
      tip: v.tip!,
      lokacija: v.lokacija!,
      kontakt: v.kontakt ?? '',
      sefId: v.sefId ?? '',
      opis: v.opis ?? '',
    };

    try {
      if (this.id) {
        await this.servis.izmeni(this.id, podaci);
        this.notifikacija.uspeh('Izmene su sačuvane.');
      } else {
        await this.servis.dodaj(podaci);
        this.notifikacija.uspeh('Laboratorija je dodata.');
      }
      this.router.navigate(['/laboratorije']);
    } catch {
      this.notifikacija.greska('Čuvanje nije uspelo.');
      this.slanje = false;
    }
  }
}

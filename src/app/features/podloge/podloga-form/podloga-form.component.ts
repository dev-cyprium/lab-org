import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TipPodloge, KlasaOpasnosti, KLASE_OPASNOSTI } from '../../../core/models';
import { PodlogeService } from '../../../core/services/podloge.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { danasIsoDatum } from '../../../shared/utils/datum';

@Component({
  selector: 'app-podloga-form',
  templateUrl: './podloga-form.component.html',
  styleUrl: './podloga-form.component.scss',
})
export class PodlogaFormComponent implements OnInit {
  forma = this.fb.group({
    naziv: ['', Validators.required],
    tip: ['podloga' as TipPodloge, Validators.required],
    namena: ['', Validators.required],
    koncentracija: [''],
    kolicina: [0, [Validators.required, Validators.min(0)]],
    jedinica: ['g', Validators.required],
    klasaOpasnosti: ['bez oznake' as KlasaOpasnosti, Validators.required],
    datumIsteka: ['', Validators.required],
    proizvodjac: [''],
    lokacija: [''],
  });

  tipovi: TipPodloge[] = ['podloga', 'reagens', 'hemikalija'];
  klase: KlasaOpasnosti[] = KLASE_OPASNOSTI;
  id: string | null = null;
  ucitavanje = false;
  slanje = false;

  constructor(
    private fb: FormBuilder,
    private servis: PodlogeService,
    private route: ActivatedRoute,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  get uredjivanje(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.ucitavanje = true;
      this.servis.ucitajJedan(this.id).subscribe((p) => {
        if (p) {
          this.forma.patchValue(p);
        }
        this.ucitavanje = false;
      });
    }
  }

  postaviDanas(): void {
    this.forma.controls.datumIsteka.setValue(danasIsoDatum());
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
      namena: v.namena!,
      koncentracija: v.koncentracija ?? '',
      kolicina: v.kolicina ?? 0,
      jedinica: v.jedinica!,
      klasaOpasnosti: v.klasaOpasnosti!,
      datumIsteka: v.datumIsteka!,
      proizvodjac: v.proizvodjac ?? '',
      lokacija: v.lokacija ?? '',
    };

    try {
      if (this.id) {
        await this.servis.izmeni(this.id, podaci);
        this.notifikacija.uspeh('Izmene su sačuvane.');
      } else {
        await this.servis.dodaj(podaci);
        this.notifikacija.uspeh('Podloga je dodata.');
      }
      this.router.navigate(['/podloge']);
    } catch {
      this.notifikacija.greska('Čuvanje nije uspelo.');
      this.slanje = false;
    }
  }
}

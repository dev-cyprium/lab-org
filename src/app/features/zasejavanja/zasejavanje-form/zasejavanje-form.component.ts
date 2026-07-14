import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RezultatZasejavanja, Uzorak, Podloga, Mikroorganizam } from '../../../core/models';
import { ZasejavanjaService } from '../../../core/services/zasejavanja.service';
import { UzorciService } from '../../../core/services/uzorci.service';
import { PodlogeService } from '../../../core/services/podloge.service';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { danasIsoDatum } from '../../../shared/utils/datum';

@Component({
  selector: 'app-zasejavanje-form',
  templateUrl: './zasejavanje-form.component.html',
  styleUrl: './zasejavanje-form.component.scss',
})
export class ZasejavanjeFormComponent implements OnInit {
  forma = this.fb.group({
    oznaka: ['', Validators.required],
    uzorakId: ['', Validators.required],
    podlogaId: ['', Validators.required],
    mikroorganizamId: ['', Validators.required],
    datumZasejavanja: ['', Validators.required],
    temperatura: [37, Validators.required],
    vremeInkubacije: [24, Validators.required],
    brojKolonija: [0, [Validators.required, Validators.min(0)]],
    rezultat: ['u toku' as RezultatZasejavanja, Validators.required],
  });

  rezultati: RezultatZasejavanja[] = ['izraslo', 'nije izraslo', 'kontaminirano', 'u toku'];
  uzorci: Uzorak[] = [];
  podloge: Podloga[] = [];
  mikroorganizmi: Mikroorganizam[] = [];
  id: string | null = null;
  ucitavanje = false;
  slanje = false;

  constructor(
    private fb: FormBuilder,
    private servis: ZasejavanjaService,
    private uzorciServis: UzorciService,
    private podlogeServis: PodlogeService,
    private mikroorganizmiServis: MikroorganizmiService,
    private route: ActivatedRoute,
    private router: Router,
    private notifikacija: NotifikacijaService
  ) {}

  get uredjivanje(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    const uzorakId = this.route.snapshot.queryParamMap.get('uzorakId');
    if (uzorakId) this.forma.patchValue({ uzorakId });
    this.uzorciServis.ucitajSve().subscribe((u) => (this.uzorci = u));
    this.podlogeServis.ucitajSve().subscribe((p) => (this.podloge = p));
    this.mikroorganizmiServis.ucitajSve().subscribe((m) => (this.mikroorganizmi = m));

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.ucitavanje = true;
      this.servis.ucitajJedan(this.id).subscribe((z) => {
        if (z) {
          this.forma.patchValue(z);
        }
        this.ucitavanje = false;
      });
    } else {
      this.forma.patchValue({ datumZasejavanja: danasIsoDatum() });
    }
  }

  postaviDanas(): void {
    this.forma.controls.datumZasejavanja.setValue(danasIsoDatum());
  }

  async sacuvaj(): Promise<void> {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.slanje = true;
    const v = this.forma.value;
    const podaci = {
      oznaka: v.oznaka!,
      uzorakId: v.uzorakId!,
      podlogaId: v.podlogaId!,
      mikroorganizamId: v.mikroorganizamId!,
      datumZasejavanja: v.datumZasejavanja!,
      temperatura: v.temperatura ?? 0,
      vremeInkubacije: v.vremeInkubacije ?? 0,
      brojKolonija: v.brojKolonija ?? 0,
      rezultat: v.rezultat!,
    };

    try {
      if (this.id) {
        await this.servis.izmeni(this.id, podaci);
        this.notifikacija.uspeh('Izmene su sačuvane.');
      } else {
        await this.servis.dodaj(podaci);
        this.notifikacija.uspeh('Zasejavanje je dodato.');
      }
      this.router.navigate(['/zasejavanja']);
    } catch {
      this.notifikacija.greska('Čuvanje nije uspelo.');
      this.slanje = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { Uzorak, Zaposleni, Laboratorija, Zasejavanje, Analiza } from '../../../core/models';
import { UzorciService } from '../../../core/services/uzorci.service';
import { ZaposleniService } from '../../../core/services/zaposleni.service';
import { LaboratorijeService } from '../../../core/services/laboratorije.service';
import { ZasejavanjaService } from '../../../core/services/zasejavanja.service';
import { AnalizeService } from '../../../core/services/analize.service';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';
import { PodlogeService } from '../../../core/services/podloge.service';
import { NotifikacijaService } from '../../../core/services/notifikacija.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

// Pomoćni tip za prikaz zasejavanja sa razrešenim nazivima.
interface ZasejavanjeRed {
  zasejavanje: Zasejavanje;
  podloga: string;
  mikroorganizam: string;
}

interface AktivnostUzorka {
  datum: string;
  naslov: string;
  opis: string;
  ikonica: string;
  putanja?: string;
}

@Component({
  selector: 'app-uzorak-detail',
  templateUrl: './uzorak-detail.component.html',
  styleUrl: './uzorak-detail.component.scss',
})
export class UzorakDetailComponent implements OnInit {
  uzorak?: Uzorak;
  uzorkovac?: Zaposleni;
  laboratorija?: Laboratorija;
  zasejavanja: ZasejavanjeRed[] = [];
  analize: Analiza[] = [];
  aktivnosti: AktivnostUzorka[] = [];
  ucitavanje = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private uzorciServis: UzorciService,
    private zaposleniServis: ZaposleniService,
    private laboratorijeServis: LaboratorijeService,
    private zasejavanjaServis: ZasejavanjaService,
    private analizeServis: AnalizeService,
    private mikroorganizmiServis: MikroorganizmiService,
    private podlogeServis: PodlogeService,
    private notifikacija: NotifikacijaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      uzorak: this.uzorciServis.ucitajJedan(id),
      zaposleni: this.zaposleniServis.ucitajSve(),
      labovi: this.laboratorijeServis.ucitajSve(),
      zasejavanja: this.zasejavanjaServis.ucitajSve(),
      analize: this.analizeServis.ucitajSve(),
      mikroorganizmi: this.mikroorganizmiServis.ucitajSve(),
      podloge: this.podlogeServis.ucitajSve(),
    }).subscribe((r) => {
      this.uzorak = r.uzorak;
      if (r.uzorak) {
        const u = r.uzorak;
        this.uzorkovac = r.zaposleni.find((z) => z.id === u.uzorkovacId);
        this.laboratorija = r.labovi.find((l) => l.id === u.laboratorijaId);
        this.analize = r.analize
          .filter((a) => a.uzorakId === u.id)
          .sort((a, b) => b.datumAnalize.localeCompare(a.datumAnalize));
        this.zasejavanja = r.zasejavanja
          .filter((z) => z.uzorakId === u.id)
          .map((z) => ({
            zasejavanje: z,
            podloga: r.podloge.find((p) => p.id === z.podlogaId)?.naziv ?? '—',
            mikroorganizam: r.mikroorganizmi.find((m) => m.id === z.mikroorganizamId)?.naziv ?? '—',
          }));
        this.aktivnosti = [
          {
            datum: u.datumPrijema,
            naslov: 'Uzorak je primljen',
            opis: `${u.kolicina} ${u.jedinica} · ${u.temperaturaPrijema} °C`,
            ikonica: 'inventory_2',
          },
          ...this.zasejavanja.map((z) => ({
            datum: z.zasejavanje.datumZasejavanja,
            naslov: `Zasejavanje ${z.zasejavanje.oznaka}`,
            opis: `${z.podloga} · ${z.zasejavanje.rezultat}`,
            ikonica: 'grain',
            putanja: `/zasejavanja/${z.zasejavanje.id}`,
          })),
          ...this.analize.map((a) => ({
            datum: a.datumAnalize,
            naslov: `Analiza ${a.sifra}`,
            opis: a.zakljucak === 'ISPRAVAN' ? 'Nalaz je ispravan' : 'Nalaz je neispravan',
            ikonica: 'fact_check',
            putanja: `/analize/${a.id}`,
          })),
        ].sort((a, b) => b.datum.localeCompare(a.datum));
      }
      this.ucitavanje = false;
    });
  }

  get korakProcesa(): number {
    if (!this.uzorak) return 0;
    if (this.uzorak.status === 'arhiviran') return 4;
    if (this.uzorak.status === 'završen') return 3;
    if (this.analize.length || this.uzorak.status === 'u analizi') return 2;
    if (this.zasejavanja.length) return 1;
    return 0;
  }

  get zakljucak(): 'ISPRAVAN' | 'NEISPRAVAN' | null {
    if (!this.analize.length) return null;
    return this.analize.some((a) => a.zakljucak === 'NEISPRAVAN') ? 'NEISPRAVAN' : 'ISPRAVAN';
  }

  get sledecaAkcija(): { naziv: string; ikonica: string; putanja: string; query?: Record<string, string> } | null {
    if (!this.uzorak || this.uzorak.status === 'arhiviran') return null;
    if (!this.zasejavanja.length) {
      return {
        naziv: 'Dodaj zasejavanje',
        ikonica: 'grain',
        putanja: '/zasejavanja/novo',
        query: { uzorakId: this.uzorak.id },
      };
    }
    if (!this.analize.length) {
      return {
        naziv: 'Kreiraj analizu',
        ikonica: 'fact_check',
        putanja: '/analize/novo',
        query: { uzorakId: this.uzorak.id },
      };
    }
    return {
      naziv: 'Otvori poslednju analizu',
      ikonica: 'arrow_forward',
      putanja: `/analize/${this.analize[0].id}`,
    };
  }

  statusKlasa(status: Uzorak['status']): string {
    if (status === 'završen') return 'ok';
    if (status === 'arhiviran') return 'neutral';
    if (status === 'u analizi') return 'upozorenje';
    return 'info';
  }

  obrisi(): void {
    if (!this.uzorak) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        naslov: 'Brisanje uzorka',
        poruka: `Da li sigurno želiš da obrišeš uzorak „${this.uzorak.naziv}“ (${this.uzorak.sifra})?`,
      },
    });
    ref.afterClosed().subscribe(async (potvrda) => {
      if (!potvrda || !this.uzorak) {
        return;
      }
      try {
        await this.uzorciServis.obrisi(this.uzorak.id);
        this.notifikacija.uspeh('Uzorak je obrisan.');
        this.router.navigate(['/uzorci']);
      } catch {
        this.notifikacija.greska('Brisanje nije uspelo.');
      }
    });
  }
}

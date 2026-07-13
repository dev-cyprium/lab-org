import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LaboratorijeService } from '../../core/services/laboratorije.service';
import { Statistika, StatistikaService } from '../../core/services/statistika.service';

interface BrzaAkcija {
  naziv: string;
  putanja: string;
  ikonica: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  statistika?: Statistika;
  ucitavanje = true;

  brzeAkcije: BrzaAkcija[] = [
    { naziv: 'Novi uzorak', putanja: '/uzorci/novo', ikonica: 'add' },
    { naziv: 'Nova analiza', putanja: '/analize/novo', ikonica: 'fact_check' },
    { naziv: 'Novo zasejavanje', putanja: '/zasejavanja/novo', ikonica: 'grain' },
  ];
  sekundarneAkcije = this.brzeAkcije.slice(1);

  constructor(
    private statistikaServis: StatistikaService,
    private laboratorijeServis: LaboratorijeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.laboratorijeServis.ucitajSve().subscribe((laboratorije) => {
      if (laboratorije.length === 0) {
        this.router.navigate(['/dobrodosli']);
        return;
      }
      this.statistikaServis.ucitajStatistiku().subscribe((s) => {
        this.statistika = s;
        this.ucitavanje = false;
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';

import { StatistikaService, Statistika } from '../../core/services/statistika.service';

interface BrzaKartica {
  naziv: string;
  putanja: string;
  ikonica: string;
  opis: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  statistika?: Statistika;
  ucitavanje = true;

  kartice: BrzaKartica[] = [
    { naziv: 'Uzorci', putanja: '/uzorci', ikonica: 'science', opis: 'Prijem i praćenje uzoraka hrane i vode' },
    { naziv: 'Analize', putanja: '/analize', ikonica: 'fact_check', opis: 'Rezultati i ocena ispravnosti' },
    { naziv: 'Mikroorganizmi', putanja: '/mikroorganizmi', ikonica: 'coronavirus', opis: 'Katalog patogena i indikatora' },
    { naziv: 'Podloge', putanja: '/podloge', ikonica: 'water_drop', opis: 'Podloge i reagensi u laboratoriji' },
  ];

  constructor(private statistikaServis: StatistikaService) {}

  ngOnInit(): void {
    this.statistikaServis.ucitajStatistiku().subscribe((s) => {
      this.statistika = s;
      this.ucitavanje = false;
    });
  }
}

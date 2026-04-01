import { Component } from '@angular/core';

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
export class DashboardComponent {
  // Prave statistike (broj uzoraka, % neispravnih...) dolaze u Fazi 2 iz StatistikaService.
  kartice: BrzaKartica[] = [
    { naziv: 'Uzorci', putanja: '/uzorci', ikonica: 'science', opis: 'Prijem i praćenje uzoraka hrane i vode' },
    { naziv: 'Analize', putanja: '/analize', ikonica: 'fact_check', opis: 'Rezultati i ocena ispravnosti' },
    { naziv: 'Mikroorganizmi', putanja: '/mikroorganizmi', ikonica: 'coronavirus', opis: 'Katalog patogena i indikatora' },
    { naziv: 'Podloge', putanja: '/podloge', ikonica: 'water_drop', opis: 'Podloge i reagensi u laboratoriji' },
  ];
}

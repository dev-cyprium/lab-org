import { Component } from '@angular/core';

interface MeniStavka {
  putanja: string;
  naziv: string;
  ikonica: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  // Stavke menija — rute se popunjavaju kroz naredne faze.
  meniStavke: MeniStavka[] = [
    { putanja: '/pocetna', naziv: 'Početna', ikonica: 'dashboard' },
    { putanja: '/uzorci', naziv: 'Uzorci', ikonica: 'science' },
    { putanja: '/analize', naziv: 'Analize', ikonica: 'fact_check' },
    { putanja: '/zasejavanja', naziv: 'Zasejavanja', ikonica: 'grain' },
    { putanja: '/mikroorganizmi', naziv: 'Mikroorganizmi', ikonica: 'coronavirus' },
    { putanja: '/podloge', naziv: 'Podloge i reagensi', ikonica: 'water_drop' },
    { putanja: '/zaposleni', naziv: 'Zaposleni', ikonica: 'badge' },
    { putanja: '/laboratorije', naziv: 'Laboratorije', ikonica: 'apartment' },
  ];
}

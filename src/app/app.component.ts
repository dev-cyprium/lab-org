import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { combineLatest, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  naslov = 'LabOrg';
  prijavljen$ = this.auth.jePrijavljen$();
  maliEkran$ = this.breakpointObserver.observe('(max-width: 900px)').pipe(
    map((rezultat) => rezultat.matches),
    shareReplay(1)
  );
  meniOtvoren = false;
  private stanjeMenija: Subscription;

  constructor(private auth: AuthService, private breakpointObserver: BreakpointObserver) {
    this.stanjeMenija = combineLatest([this.prijavljen$, this.maliEkran$]).subscribe(
      ([prijavljen, maliEkran]) => (this.meniOtvoren = prijavljen && !maliEkran)
    );
  }

  ngOnDestroy(): void {
    this.stanjeMenija.unsubscribe();
  }

  zatvoriMeni(drawer: MatSidenav): void {
    if (drawer.mode === 'over') drawer.close();
  }
}

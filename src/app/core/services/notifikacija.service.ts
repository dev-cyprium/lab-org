import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Omotač oko MatSnackBar — jedinstvene poruke o uspehu i grešci.
@Injectable({ providedIn: 'root' })
export class NotifikacijaService {
  constructor(private snackBar: MatSnackBar) {}

  uspeh(poruka: string): void {
    this.snackBar.open(poruka, 'U redu', { duration: 3000, panelClass: 'snack-uspeh' });
  }

  greska(poruka: string): void {
    this.snackBar.open(poruka, 'Zatvori', { duration: 5000, panelClass: 'snack-greska' });
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface PotvrdaPodaci {
  naslov: string;
  poruka: string;
  potvrdaTekst?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public podaci: PotvrdaPodaci,
    private ref: MatDialogRef<ConfirmDialogComponent>
  ) {}

  potvrdi(): void {
    this.ref.close(true);
  }
}

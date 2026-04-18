import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { OcenaPipe } from './pipes/ocena.pipe';
import { CfuPipe } from './pipes/cfu.pipe';
import { GramPipe } from './pipes/gram.pipe';
import { DatumSrPipe } from './pipes/datum-sr.pipe';
import { IstekPipe } from './pipes/istek.pipe';
import { KlasaOpasnostiPipe } from './pipes/klasa-opasnosti.pipe';

import { HighlightOpasnoDirective } from './directives/highlight-opasno.directive';
import { AutoFocusDirective } from './directives/auto-focus.directive';

const PIPES = [OcenaPipe, CfuPipe, GramPipe, DatumSrPipe, IstekPipe, KlasaOpasnostiPipe];
const DIREKTIVE = [HighlightOpasnoDirective, AutoFocusDirective];

// Sve što se deli između feature modula ide ovde (Material, forme, pipe-ovi, direktive).
@NgModule({
  declarations: [PageNotFoundComponent, ...PIPES, ...DIREKTIVE],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PageNotFoundComponent,
    ...PIPES,
    ...DIREKTIVE,
  ],
})
export class SharedModule {}

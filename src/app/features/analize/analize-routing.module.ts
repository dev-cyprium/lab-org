import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnalizeListComponent } from './analize-list/analize-list.component';
import { AnalizaDetailComponent } from './analiza-detail/analiza-detail.component';
import { AnalizaFormComponent } from './analiza-form/analiza-form.component';

const routes: Routes = [
  { path: '', component: AnalizeListComponent },
  { path: 'novo', component: AnalizaFormComponent },
  { path: ':id/izmena', component: AnalizaFormComponent },
  { path: ':id', component: AnalizaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalizeRoutingModule {}

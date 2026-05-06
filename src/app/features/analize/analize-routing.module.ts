import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnalizeListComponent } from './analize-list/analize-list.component';
import { AnalizaDetailComponent } from './analiza-detail/analiza-detail.component';

const routes: Routes = [
  { path: '', component: AnalizeListComponent },
  { path: ':id', component: AnalizaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalizeRoutingModule {}

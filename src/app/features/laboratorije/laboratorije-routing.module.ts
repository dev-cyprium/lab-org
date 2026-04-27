import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LaboratorijeListComponent } from './laboratorije-list/laboratorije-list.component';
import { LaboratorijaDetailComponent } from './laboratorija-detail/laboratorija-detail.component';

const routes: Routes = [
  { path: '', component: LaboratorijeListComponent },
  { path: ':id', component: LaboratorijaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaboratorijeRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LaboratorijeListComponent } from './laboratorije-list/laboratorije-list.component';
import { LaboratorijaDetailComponent } from './laboratorija-detail/laboratorija-detail.component';
import { LaboratorijaFormComponent } from './laboratorija-form/laboratorija-form.component';

// 'novo' pre ':id' da se ne bi protumačilo kao id.
const routes: Routes = [
  { path: '', component: LaboratorijeListComponent },
  { path: 'novo', component: LaboratorijaFormComponent },
  { path: ':id/izmena', component: LaboratorijaFormComponent },
  { path: ':id', component: LaboratorijaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaboratorijeRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PodlogeListComponent } from './podloge-list/podloge-list.component';
import { PodlogaDetailComponent } from './podloga-detail/podloga-detail.component';
import { PodlogaFormComponent } from './podloga-form/podloga-form.component';

const routes: Routes = [
  { path: '', component: PodlogeListComponent },
  { path: 'novo', component: PodlogaFormComponent },
  { path: ':id/izmena', component: PodlogaFormComponent },
  { path: ':id', component: PodlogaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PodlogeRoutingModule {}

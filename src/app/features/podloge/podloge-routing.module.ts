import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PodlogeListComponent } from './podloge-list/podloge-list.component';
import { PodlogaDetailComponent } from './podloga-detail/podloga-detail.component';

const routes: Routes = [
  { path: '', component: PodlogeListComponent },
  { path: ':id', component: PodlogaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PodlogeRoutingModule {}

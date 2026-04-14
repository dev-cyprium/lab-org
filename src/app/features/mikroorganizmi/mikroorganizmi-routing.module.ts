import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MikroorganizmiListComponent } from './mikroorganizmi-list/mikroorganizmi-list.component';
import { MikroorganizamDetailComponent } from './mikroorganizam-detail/mikroorganizam-detail.component';

const routes: Routes = [
  { path: '', component: MikroorganizmiListComponent },
  { path: ':id', component: MikroorganizamDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MikroorganizmiRoutingModule {}

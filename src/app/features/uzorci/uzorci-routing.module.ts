import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UzorciListComponent } from './uzorci-list/uzorci-list.component';
import { UzorakDetailComponent } from './uzorak-detail/uzorak-detail.component';
import { UzorakFormComponent } from './uzorak-form/uzorak-form.component';

const routes: Routes = [
  { path: '', component: UzorciListComponent },
  { path: 'novo', component: UzorakFormComponent },
  { path: ':id/izmena', component: UzorakFormComponent },
  { path: ':id', component: UzorakDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UzorciRoutingModule {}

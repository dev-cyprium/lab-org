import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ZaposleniListComponent } from './zaposleni-list/zaposleni-list.component';
import { ZaposleniDetailComponent } from './zaposleni-detail/zaposleni-detail.component';
import { ZaposleniFormComponent } from './zaposleni-form/zaposleni-form.component';

const routes: Routes = [
  { path: '', component: ZaposleniListComponent },
  { path: 'novo', component: ZaposleniFormComponent },
  { path: ':id/izmena', component: ZaposleniFormComponent },
  { path: ':id', component: ZaposleniDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZaposleniRoutingModule {}

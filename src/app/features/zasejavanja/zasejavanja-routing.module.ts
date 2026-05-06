import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ZasejavanjaListComponent } from './zasejavanja-list/zasejavanja-list.component';
import { ZasejavanjeDetailComponent } from './zasejavanje-detail/zasejavanje-detail.component';

const routes: Routes = [
  { path: '', component: ZasejavanjaListComponent },
  { path: ':id', component: ZasejavanjeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZasejavanjaRoutingModule {}

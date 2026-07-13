import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ZahteviComponent } from './zahtevi.component';

const routes: Routes = [{ path: '', component: ZahteviComponent }];

@NgModule({
  declarations: [ZahteviComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ZahteviModule {}

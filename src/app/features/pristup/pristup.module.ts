import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { PristupComponent } from './pristup.component';

const routes: Routes = [{ path: '', component: PristupComponent }];

@NgModule({
  declarations: [PristupComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PristupModule {}

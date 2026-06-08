import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ZaposleniRoutingModule } from './zaposleni-routing.module';
import { ZaposleniListComponent } from './zaposleni-list/zaposleni-list.component';
import { ZaposleniDetailComponent } from './zaposleni-detail/zaposleni-detail.component';
import { ZaposleniFormComponent } from './zaposleni-form/zaposleni-form.component';

@NgModule({
  declarations: [ZaposleniListComponent, ZaposleniDetailComponent, ZaposleniFormComponent],
  imports: [SharedModule, ZaposleniRoutingModule],
})
export class ZaposleniModule {}

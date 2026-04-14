import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { MikroorganizmiRoutingModule } from './mikroorganizmi-routing.module';
import { MikroorganizmiListComponent } from './mikroorganizmi-list/mikroorganizmi-list.component';
import { MikroorganizamDetailComponent } from './mikroorganizam-detail/mikroorganizam-detail.component';

@NgModule({
  declarations: [MikroorganizmiListComponent, MikroorganizamDetailComponent],
  imports: [SharedModule, MikroorganizmiRoutingModule],
})
export class MikroorganizmiModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PodlogeRoutingModule } from './podloge-routing.module';
import { PodlogeListComponent } from './podloge-list/podloge-list.component';
import { PodlogaDetailComponent } from './podloga-detail/podloga-detail.component';

@NgModule({
  declarations: [PodlogeListComponent, PodlogaDetailComponent],
  imports: [SharedModule, PodlogeRoutingModule],
})
export class PodlogeModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LaboratorijeRoutingModule } from './laboratorije-routing.module';
import { LaboratorijeListComponent } from './laboratorije-list/laboratorije-list.component';
import { LaboratorijaDetailComponent } from './laboratorija-detail/laboratorija-detail.component';

@NgModule({
  declarations: [LaboratorijeListComponent, LaboratorijaDetailComponent],
  imports: [SharedModule, LaboratorijeRoutingModule],
})
export class LaboratorijeModule {}

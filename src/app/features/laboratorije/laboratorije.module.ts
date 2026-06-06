import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LaboratorijeRoutingModule } from './laboratorije-routing.module';
import { LaboratorijeListComponent } from './laboratorije-list/laboratorije-list.component';
import { LaboratorijaDetailComponent } from './laboratorija-detail/laboratorija-detail.component';
import { LaboratorijaFormComponent } from './laboratorija-form/laboratorija-form.component';

@NgModule({
  declarations: [LaboratorijeListComponent, LaboratorijaDetailComponent, LaboratorijaFormComponent],
  imports: [SharedModule, LaboratorijeRoutingModule],
})
export class LaboratorijeModule {}

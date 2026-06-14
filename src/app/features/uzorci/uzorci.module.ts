import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { UzorciRoutingModule } from './uzorci-routing.module';
import { UzorciListComponent } from './uzorci-list/uzorci-list.component';
import { UzorakDetailComponent } from './uzorak-detail/uzorak-detail.component';
import { UzorakFormComponent } from './uzorak-form/uzorak-form.component';

@NgModule({
  declarations: [UzorciListComponent, UzorakDetailComponent, UzorakFormComponent],
  imports: [SharedModule, UzorciRoutingModule],
})
export class UzorciModule {}

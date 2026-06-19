import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ZasejavanjaRoutingModule } from './zasejavanja-routing.module';
import { ZasejavanjaListComponent } from './zasejavanja-list/zasejavanja-list.component';
import { ZasejavanjeDetailComponent } from './zasejavanje-detail/zasejavanje-detail.component';
import { ZasejavanjeFormComponent } from './zasejavanje-form/zasejavanje-form.component';

@NgModule({
  declarations: [ZasejavanjaListComponent, ZasejavanjeDetailComponent, ZasejavanjeFormComponent],
  imports: [SharedModule, ZasejavanjaRoutingModule],
})
export class ZasejavanjaModule {}

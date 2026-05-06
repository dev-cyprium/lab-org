import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ZasejavanjaRoutingModule } from './zasejavanja-routing.module';
import { ZasejavanjaListComponent } from './zasejavanja-list/zasejavanja-list.component';
import { ZasejavanjeDetailComponent } from './zasejavanje-detail/zasejavanje-detail.component';

@NgModule({
  declarations: [ZasejavanjaListComponent, ZasejavanjeDetailComponent],
  imports: [SharedModule, ZasejavanjaRoutingModule],
})
export class ZasejavanjaModule {}

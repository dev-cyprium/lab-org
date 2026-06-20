import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { AnalizeRoutingModule } from './analize-routing.module';
import { AnalizeListComponent } from './analize-list/analize-list.component';
import { AnalizaDetailComponent } from './analiza-detail/analiza-detail.component';
import { AnalizaFormComponent } from './analiza-form/analiza-form.component';

@NgModule({
  declarations: [AnalizeListComponent, AnalizaDetailComponent, AnalizaFormComponent],
  imports: [SharedModule, AnalizeRoutingModule],
})
export class AnalizeModule {}

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';

// Singleton moduli, servisi i layout. Uvozi se SAMO u AppModule.
@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent],
  imports: [SharedModule, RouterModule],
  exports: [NavbarComponent, SidebarComponent, FooterComponent],
})
export class CoreModule {
  // Zaštita da se CoreModule ne uveze dvaput (npr. iz nekog feature modula).
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('CoreModule je već učitan. Uvozi ga samo AppModule.');
    }
  }
}

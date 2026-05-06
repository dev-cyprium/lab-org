import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

// Feature moduli se učitavaju lenjo (lazy). Nove rute (uzorci, analize...) dodaju se kroz faze.
const routes: Routes = [
  { path: '', redirectTo: 'pocetna', pathMatch: 'full' },
  {
    path: 'pocetna',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'mikroorganizmi',
    loadChildren: () =>
      import('./features/mikroorganizmi/mikroorganizmi.module').then(
        (m) => m.MikroorganizmiModule
      ),
  },
  {
    path: 'laboratorije',
    loadChildren: () =>
      import('./features/laboratorije/laboratorije.module').then((m) => m.LaboratorijeModule),
  },
  {
    path: 'zaposleni',
    loadChildren: () =>
      import('./features/zaposleni/zaposleni.module').then((m) => m.ZaposleniModule),
  },
  {
    path: 'podloge',
    loadChildren: () => import('./features/podloge/podloge.module').then((m) => m.PodlogeModule),
  },
  {
    path: 'uzorci',
    loadChildren: () => import('./features/uzorci/uzorci.module').then((m) => m.UzorciModule),
  },
  {
    path: 'zasejavanja',
    loadChildren: () =>
      import('./features/zasejavanja/zasejavanja.module').then((m) => m.ZasejavanjaModule),
  },
  {
    path: 'analize',
    loadChildren: () => import('./features/analize/analize.module').then((m) => m.AnalizeModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

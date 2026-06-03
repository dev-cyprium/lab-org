import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

// Prijava je obavezna za sve feature rute (authGuard). Auth rute (prijava/registracija) su otvorene.
const routes: Routes = [
  { path: '', redirectTo: 'pocetna', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'pocetna',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'dobrodosli',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/onboarding/onboarding.module').then((m) => m.OnboardingModule),
  },
  {
    path: 'mikroorganizmi',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/mikroorganizmi/mikroorganizmi.module').then(
        (m) => m.MikroorganizmiModule
      ),
  },
  {
    path: 'laboratorije',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/laboratorije/laboratorije.module').then((m) => m.LaboratorijeModule),
  },
  {
    path: 'zaposleni',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/zaposleni/zaposleni.module').then((m) => m.ZaposleniModule),
  },
  {
    path: 'podloge',
    canActivate: [authGuard],
    loadChildren: () => import('./features/podloge/podloge.module').then((m) => m.PodlogeModule),
  },
  {
    path: 'uzorci',
    canActivate: [authGuard],
    loadChildren: () => import('./features/uzorci/uzorci.module').then((m) => m.UzorciModule),
  },
  {
    path: 'zasejavanja',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/zasejavanja/zasejavanja.module').then((m) => m.ZasejavanjaModule),
  },
  {
    path: 'analize',
    canActivate: [authGuard],
    loadChildren: () => import('./features/analize/analize.module').then((m) => m.AnalizeModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

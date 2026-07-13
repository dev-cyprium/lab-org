import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

// Pušta samo korisnike koji su član bar jedne firme; ostale vodi na ekran za pristup.
export const clanGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.mojeKompanije$.pipe(
    take(1),
    map((firme) => (firme.length ? true : router.createUrlTree(['/pristup'])))
  );
};

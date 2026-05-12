import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

// Pušta samo prijavljene korisnike; ostale vraća na /prijava.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.jePrijavljen$().pipe(
    take(1),
    map((prijavljen) => (prijavljen ? true : router.createUrlTree(['/prijava'])))
  );
};

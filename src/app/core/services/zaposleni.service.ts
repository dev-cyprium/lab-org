import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { Zaposleni } from '../models';
import { FirestoreCrudServis } from './firestore-crud.servis';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ZaposleniService extends FirestoreCrudServis<Zaposleni> {
  protected putanja = 'zaposleni';

  constructor(firestore: Firestore, auth: AuthService) {
    super(firestore, auth);
  }
}

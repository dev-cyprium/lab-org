import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { Podloga } from '../models';
import { FirestoreCrudServis } from './firestore-crud.servis';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PodlogeService extends FirestoreCrudServis<Podloga> {
  protected putanja = 'podloge';

  constructor(firestore: Firestore, auth: AuthService) {
    super(firestore, auth);
  }
}

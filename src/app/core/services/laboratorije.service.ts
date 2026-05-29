import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { Laboratorija } from '../models';
import { FirestoreCrudServis } from './firestore-crud.servis';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class LaboratorijeService extends FirestoreCrudServis<Laboratorija> {
  protected putanja = 'laboratorije';

  constructor(firestore: Firestore, auth: AuthService) {
    super(firestore, auth);
  }
}

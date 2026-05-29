import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { Analiza } from '../models';
import { FirestoreCrudServis } from './firestore-crud.servis';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AnalizeService extends FirestoreCrudServis<Analiza> {
  protected putanja = 'analize';

  constructor(firestore: Firestore, auth: AuthService) {
    super(firestore, auth);
  }
}

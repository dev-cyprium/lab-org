import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { Uzorak } from '../models';
import { FirestoreCrudServis } from './firestore-crud.servis';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UzorciService extends FirestoreCrudServis<Uzorak> {
  protected putanja = 'uzorci';

  constructor(firestore: Firestore, auth: AuthService) {
    super(firestore, auth);
  }
}

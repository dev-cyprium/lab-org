import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { Zasejavanje } from '../models';
import { FirestoreCrudServis } from './firestore-crud.servis';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ZasejavanjaService extends FirestoreCrudServis<Zasejavanje> {
  protected putanja = 'zasejavanja';

  constructor(firestore: Firestore, auth: AuthService) {
    super(firestore, auth);
  }
}

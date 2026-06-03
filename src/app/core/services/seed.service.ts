import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, collection, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './auth.service';

// Uvozi demo podatke iz JSON-a u Firestore za AKTIVNU kompaniju.
// Stari string ID-jevi (lab-001...) se mapiraju na nove Firestore ID-jeve da bi reference ostale ispravne.
// Reference na mikroorganizme (mo-xxx) se NE menjaju — oni su globalni i čitaju se iz JSON-a.
@Injectable({ providedIn: 'root' })
export class SeedService {
  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private auth: AuthService
  ) {}

  private ucitaj<T>(fajl: string): Promise<T[]> {
    return firstValueFrom(this.http.get<T[]>(`assets/data/${fajl}`));
  }

  async uveziDemoPodatke(): Promise<void> {
    const kompanijaId = this.auth.kompanijaId;
    if (!kompanijaId) {
      throw new Error('Nema aktivne kompanije.');
    }

    const [laboratorije, zaposleni, podloge, uzorci, zasejavanja, analize] = await Promise.all([
      this.ucitaj<any>('laboratorije.json'),
      this.ucitaj<any>('zaposleni.json'),
      this.ucitaj<any>('podloge.json'),
      this.ucitaj<any>('uzorci.json'),
      this.ucitaj<any>('zasejavanja.json'),
      this.ucitaj<any>('analize.json'),
    ]);

    const mapLab = new Map<string, string>();
    const mapZap = new Map<string, string>();
    const mapPod = new Map<string, string>();
    const mapUz = new Map<string, string>();

    // 1. laboratorije (sefId popunjavamo kasnije jer zavisi od zaposlenih)
    for (const l of laboratorije) {
      const { id, sefId, ...ostatak } = l;
      const ref = await addDoc(collection(this.firestore, 'laboratorije'), { ...ostatak, sefId: '', kompanijaId });
      mapLab.set(id, ref.id);
    }

    // 2. zaposleni (remap laboratorijaId)
    for (const z of zaposleni) {
      const { id, laboratorijaId, ...ostatak } = z;
      const ref = await addDoc(collection(this.firestore, 'zaposleni'), {
        ...ostatak,
        laboratorijaId: mapLab.get(laboratorijaId) ?? '',
        kompanijaId,
      });
      mapZap.set(id, ref.id);
    }

    // 3. dopuni sefId na laboratorijama
    for (const l of laboratorije) {
      await updateDoc(doc(this.firestore, 'laboratorije', mapLab.get(l.id)!), {
        sefId: mapZap.get(l.sefId) ?? '',
      });
    }

    // 4. podloge
    for (const p of podloge) {
      const { id, ...ostatak } = p;
      const ref = await addDoc(collection(this.firestore, 'podloge'), { ...ostatak, kompanijaId });
      mapPod.set(id, ref.id);
    }

    // 5. uzorci (remap uzorkovacId + laboratorijaId)
    for (const u of uzorci) {
      const { id, uzorkovacId, laboratorijaId, ...ostatak } = u;
      const ref = await addDoc(collection(this.firestore, 'uzorci'), {
        ...ostatak,
        uzorkovacId: mapZap.get(uzorkovacId) ?? '',
        laboratorijaId: mapLab.get(laboratorijaId) ?? '',
        kompanijaId,
      });
      mapUz.set(id, ref.id);
    }

    // 6. zasejavanja (remap uzorak/podloga; mikroorganizamId ostaje isti)
    for (const z of zasejavanja) {
      const { id, uzorakId, podlogaId, ...ostatak } = z;
      await addDoc(collection(this.firestore, 'zasejavanja'), {
        ...ostatak,
        uzorakId: mapUz.get(uzorakId) ?? '',
        podlogaId: mapPod.get(podlogaId) ?? '',
        kompanijaId,
      });
    }

    // 7. analize (remap uzorak/zaposleni; stavke sa mikroorganizamId ostaju iste)
    for (const a of analize) {
      const { id, uzorakId, zaposleniId, ...ostatak } = a;
      await addDoc(collection(this.firestore, 'analize'), {
        ...ostatak,
        uzorakId: mapUz.get(uzorakId) ?? '',
        zaposleniId: mapZap.get(zaposleniId) ?? '',
        kompanijaId,
      });
    }
  }
}

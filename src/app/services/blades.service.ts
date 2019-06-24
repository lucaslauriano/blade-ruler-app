import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Blades {
  categorie: string;
  img: string;
  montage: string;
  name: string;
  shape: string;
  status: string;
  storageLocation: string;
}

@Injectable({
  providedIn: 'root'
})
export class BladesService {
  private bladesCollection: AngularFirestoreCollection<Blades>;

  private blades: Observable<Blades[]>;

  constructor(db: AngularFirestore) {
    this.bladesCollection = db.collection<Blades>('blades');

    this.blades = this.bladesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getBlades() {
    return this.blades;
  }

  getBlade(id) {
    return this.bladesCollection.doc<Blades>(id).valueChanges();
  }

  updateBlade(blade: Blades, id: string) {
    return this.bladesCollection.doc(id).update(blade);
  }

  addBlade(blade: Blades) {
    return this.bladesCollection.add(blade);
  }

  removeBlade(id) {
    return this.bladesCollection.doc(id).delete();
  }
}

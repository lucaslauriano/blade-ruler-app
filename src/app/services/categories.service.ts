import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Categories {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categoriesCollection: AngularFirestoreCollection<Categories>;

  private categories: Observable<Categories[]>;

  constructor(db: AngularFirestore) {
    this.categoriesCollection = db.collection<Categories>('categories');

    this.categories = this.categoriesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCategories() {
    return this.categories;
  }

  getCategorie(id) {
    return this.categoriesCollection.doc<Categories>(id).valueChanges();
  }

  updateCategorie(categorie: Categories, id: string) {
    return this.categoriesCollection.doc(id).update(categorie);
  }

  addCategorie(categorie: Categories) {
    return this.categoriesCollection.add(categorie);
  }

  removeCategorie(id) {
    return this.categoriesCollection.doc(id).delete();
  }
}

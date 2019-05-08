import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Users {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersCollection: AngularFirestoreCollection<Users>;

  private users: Observable<Users[]>;

  constructor(db: AngularFirestore) {
    this.usersCollection = db.collection<Users>('users');

    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUsers() {
    return this.users;
  }

  getCategorie(id) {
    return this.usersCollection.doc<Users>(id).valueChanges();
  }

  updateCategorie(user: Users, id: string) {
    return this.usersCollection.doc(id).update(user);
  }

  addCategorie(user: Users) {
    return this.usersCollection.add(user);
  }

  removeCategorie(id) {
    return this.usersCollection.doc(id).delete();
  }
}

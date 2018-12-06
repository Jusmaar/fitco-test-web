import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { IContact } from '../models/contact.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactsCollection: AngularFirestoreCollection<IContact>;
  contacts: Observable<any>;
  constructor(
    public afs: AngularFirestore
  ) {
    this.contactsCollection = afs.collection<IContact>('contacts');
    this.contacts = this.contactsCollection.snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IContact;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  getContacts(): Observable<Array<IContact>> {
    return this.contacts;
  }

  addContact(contact: IContact): void {
    this.contactsCollection.add(contact);
  }
}

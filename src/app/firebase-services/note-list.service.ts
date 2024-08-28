import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  query,
  orderBy,
  limit,
  where,
  Firestore,
  collectionData,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  unsubNotes;
  unsubMarkedNotes;
  unsubTrash;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      console.log(err);
    });
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJSON(note)).catch((err) => {
        console.log(err);
      });
      // .then();
    }
  }
  // (err) => {console.log(err);}).then((docRef) => {console.log('document written with ID: ', docRef?.id);})

  getCleanJSON(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note): string {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, colId: 'notes' | 'trash') {
    if (colId == 'notes') {
      await addDoc(this.getNotesRef(), item)
        .catch((err) => {
          console.log(err);
        })
        .then((docRef) => {
          console.log('Document created with ID: ', docRef?.id);
        });
    } else {
      await addDoc(this.getTrashRef(), item)
        .catch((err) => {
          console.log(err);
        })
        .then((docRef) => {
          console.log('Document moved to Trash with ID: ', docRef?.id);
        });
    }
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }

  subNotesList() {
    // let ref = collection(
    //   this.firestore,
    //   'notes/2jUqOsWg2LgpCbM1h9pl/extraSammlung'
    // );
    // const q = query(ref, limit(100));

    const q = query(this.getNotesRef(), limit(100));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
      list.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('New note: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('Modified note: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed note: ', change.doc.data());
        }
      });
    });
  }

  subMarkedNotesList() {
    const q = query(
      this.getNotesRef(),
      where('marked', '==', 'true'),
      limit(100)
    );
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach((element) => {
        this.normalMarkedNotes.push(
          this.setNoteObject(element.data(), element.id)
        );
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  getNotesRef() {
    let notesRef = collection(this.firestore, 'notes');

    console.log('getNotesRef was called and gave:', notesRef);
    return notesRef;
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}

import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collectionData, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { elementAt, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {
trashNotes: Note[] = [];
normalNotes: Note[] = [];


  unsubTrash;  
  unsubNotes = () => {}; 


  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();   
    };


  async deleteNote (colId: "notes" | "trash", docId: string){
    await  deleteDoc(this.getSingleDocRef(colId, docId)).catch(
        (err) =>  {console.log(err);})
    }

  async updateNote(note: Note){
    if(note.id){
    let colRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(colRef, this.getCleanJSON(note)).catch(
      (err) => {console.log(err);}).then(); 
    }}
  // (err) => {console.log(err);}).then((docRef) => {console.log('document written with ID: ', docRef?.id);})


getCleanJSON(note: Note): {} {
  return {
    type: note.type,
    title: note.title,
    content: note.content,
    marked: note.marked,
  }
}

getColIdFromNote(note: Note){
if(note.id){
  return 'notes';
} else {
  return 'trash';
}
}

  async addNote(item: Note, colId: "notes" | "trash"){
    await addDoc(this.getNotesRef(), item).catch(
(err)=>{console.log(err)}
    ).then(
    (docRef)=>{console.log('document written with ID: ', docRef?.id);})
  }
  

  ngOnDestroy(){
    this.unsubNotes();
    this.unsubTrash();
  }
  
  subNotesList(){
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
        list.forEach(element => {      
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
      });
  }


  subTrashList()  {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
      this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
      });
  }

  setNoteObject(obj: any, id: string): Note {
    return {  
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');}


  getTrashRef() {
      return collection(this.firestore, 'trash');}
    
  getSingleDocRef(colId: string, docId: string){
    return doc(collection(this.firestore, colId), docId);
  }
}


import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collectionData, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { elementAt, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {
trashNotes: Note[] = [];
normalNotes: Note[] = [];


  unsubList;  
  unsubSingle = () => {}; 

  items;
  items$: Observable<any>;
  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.unsubList = onSnapshot(this.getNotesRef(), (list) => {
      list.forEach(element => {
      console.log(element.id);
      })
      });
  
     
      this.items$ = collectionData(this.getNotesRef()) 
      this.items = this.items$.subscribe((list) => {
        list.forEach((element: any) => {
          console.log(element);
        });
      })
   

      // this.unsubSingle = onSnapshot(this.getSingleDocRef("notes", "AVQ20nwly6hPobaMCD0d"), (element) => {
      // // und hier kann man mit dem Element nun machen was man will
      // })
      
    };

    ngOnDestroy(){
      this. unsubList();
      this.items.unsubscribe();
    }
  
    
  getNotesRef() {
    return collection(this.firestore, 'notes');}


  getTrashRef() {
      return collection(this.firestore, 'trash');}
    
getSingleDocRef(colId: string, docId: string){
return doc(collection(this.firestore, 'collId'), docId);
}
}

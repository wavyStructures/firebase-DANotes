import { Injectable, inject } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore: Firestore = inject(Firestore);


  constructor() { }
}

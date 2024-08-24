import { Component, OnInit } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NoteComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss'
})
export class NoteListComponent implements OnInit {
  noteList: Note[] = [];
  favFilter: "all" | "fav" = "all";
  status: "notes" | "trash" = "notes";

  constructor(public noteService: NoteListService) {
      }

  ngOnInit(){
    this.updateNoteList();
  }

  getList(listToGet: 'normal'|'trash'): Note[]{
      if (listToGet == 'normal'){
    return this.noteService.normalNotes;
  } else if(listToGet == 'trash'){
    return this.noteService.trashNotes
  }
    return [];
  }

  updateNoteList(){
    this.noteList = this.getList(this.status === 'notes' ? 'normal' : 'trash');
   
  }

  changeFavFilter(filter:"all" | "fav"){
    this.favFilter = filter;
    this.updateNoteList();
  }

  changeTrashStatus(){
    if(this.status == "trash"){
      this.status = "notes";
    } else {
      this.status = "trash";
      this.favFilter = "all";
    }
    this.updateNoteList();
  }


  getDummyData(): Note[] {
    return [
      {
        id: "21sasd561dd4sdf",
        type: "note",
        title: "Block, Inline, and Inline-Block",
        content: "https://www.youtube.com/watch?v=x_i2gga-sYg",
        marked: true,
      },
      {
        id: "25sd4f561w54sdf",
        type: "note",
        title: "css selector",
        content: `kind p > b   (direktes kind) 
        nachfahren p b  (alle nachfahren)
        geschwister p ~ b (auf gleicher ebene ist VOR dem p ein b)`,
        marked: true,
      },
      {
        id: "54a4s6d546ff",
        type: "note",
        title: "aufräumen",
        content: "Wohnzimmer saugen",
        marked: false,
      },
      {
        id: "2a35s4d654a6s4d",
        type: "note",
        title: "links",
        content: `Reihenfolge: a:visited 
        a:focus 
        a:hover 
        a:active
        merkspruch: LoVe HAte`,
        marked: true,
      }
    ];
  }

}

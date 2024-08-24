import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  @Input() note!:Note;
  edit = false;
  hovered = false;
  
  constructor(private noteService: NoteListService){}

  changeMarkedStatus(){
    this.note.marked = !this.note.marked;
    this.saveNote();
  }

  deleteHovered(){
    if(!this.edit){
      this.hovered = false;
    }
  }

  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    this.edit = false;
    this.saveNote();
  }

  moveToTrash(){
    if(this.note.id){
      this.note.type = 'trash';
      let docId = this.note.id;
      this.noteService.addNote(this.note, "trash");
      this.noteService.deleteNote("notes", docId);
    }
    // hier wäre jetzt für undefined ein console.log gut, aber wir wissen ja wie wir es definiert haben
  }

  moveToNotes(){
    this.note.type = 'note';
  }

  deleteNote(){
    if(this.note.id){
      let docId = this.note.id;
      delete this.note.id;
      this.noteService.deleteNote("notes", docId);
    }
  }

  saveNote(){
    this.noteService.updateNote(this.note);
  }
}

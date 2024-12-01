import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './models/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}


  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const newNote = new this.noteModel(createNoteDto);
    return newNote.save();
  }

  
  async findAllByUser(userId: string): Promise<Note[]> {
    return this.noteModel.find({ user_id: userId }).exec();
  }

 
  async findOne(noteId: string): Promise<Note> {
    return this.noteModel.findById(noteId).exec();
  }


  async update(
    noteId: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.noteModel
      .findByIdAndUpdate(noteId, updateNoteDto, { new: true })
      .exec();
  }


  async remove(noteId: string): Promise<Note> {
    return this.noteModel.findByIdAndDelete(noteId).exec();
  }
}

import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  
  @Post()
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

 
  @Get(':userId')
  async getNotes(@Param('userId') userId: string) {
    return this.notesService.findAllByUser(userId);
  }

  
  @Get('note/:noteId')
  async getNoteById(@Param('noteId') noteId: string) {
    return this.notesService.findOne(noteId);
  }


  @Patch('note/:noteId')
  async updateNote(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(noteId, updateNoteDto);
  }

  
  @Delete('note/:noteId')
  async deleteNote(@Param('noteId') noteId: string) {
    return this.notesService.remove(noteId);
  }
}

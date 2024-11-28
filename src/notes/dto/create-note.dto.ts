export class CreateNoteDto {
    note_id: string;
    user_id: string;
    course_id: string;
    content: string;
    created_at: Date;
    last_updated: Date;
  }
  
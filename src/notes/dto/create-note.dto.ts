export class CreateNoteDto {
    readonly note_id: string;
    readonly user_id: string;
    readonly course_id: string;
    readonly content: string;
    readonly created_at: Date;
    readonly last_updated: Date;
  }
  
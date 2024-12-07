import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { Forum, ForumSchema } from './models/forum.schema';
import { ThreadModule } from '../threads/threads.module';  // Import ThreadModule for accessing ThreadService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
    ThreadModule,  // Import ThreadModule to interact with threads
  ],
  providers: [ForumService],
  exports: [ForumService],  // Export ForumService if it needs to be used in other modules
})
export class ForumModule {}

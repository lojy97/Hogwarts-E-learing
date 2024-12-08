import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { Forum, ForumSchema } from './models/forum.schema';
import { ThreadModule } from '../threads/threads.module';  // Import ThreadModule for accessing ThreadService
import { Thread, ThreadSchema } from '../threads/models/threads.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }, { name: Thread.name, schema: ThreadSchema }]),
    ThreadModule,  // Import ThreadModule to interact with threads
  ],
  providers: [ForumService],
  exports: [ForumService,MongooseModule],  // Export ForumService if it needs to be used in other modules
})
export class ForumModule {}

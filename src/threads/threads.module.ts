import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { ThreadController } from './threads.controller';
import { ThreadService } from './threads.service';
import { Thread, ThreadSchema } from './models/threads.schema'; // Import Thread schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]), // Register schema
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
  exports: [ThreadService], // Export if needed elsewhere
})
export class ThreadsModule {}

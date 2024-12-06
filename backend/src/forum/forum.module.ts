import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { Forum, ForumSchema } from './models/forum.schema'; // Import Forum schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]), // Register schema
  ],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService], // Export if needed in other modules
})
export class ForumModule {}

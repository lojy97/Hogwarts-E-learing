// email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Export the EmailService for use in other modules
})
export class EmailModule {}
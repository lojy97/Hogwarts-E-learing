import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notifications,NotificationssSchema } from './models/notifications.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
   imports: [
      MongooseModule.forFeature([{ name: Notifications.name, schema:  NotificationssSchema }]) 
   ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}

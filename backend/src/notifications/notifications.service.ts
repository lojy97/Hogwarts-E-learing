import { Injectable } from '@nestjs/common';
import { NotificationsDocument,Notifications } from './models/notifications.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class NotificationsService {
     constructor(
            @InjectModel(Notifications.name) private NotificationModel: mongoose.Model<Notifications>
        ) {}
     async create(notiData: Notifications): Promise<NotificationsDocument> {
        const newNot= new this.NotificationModel(notiData);
        return await newNot.save();
     }
      async findAll(): Promise<NotificationsDocument[]> {
             let responses=await this.NotificationModel.find();
             return responses;
           }
         
           async findById(id: string): Promise<NotificationsDocument> {
             return await this.NotificationModel.findById(id);
           }
}

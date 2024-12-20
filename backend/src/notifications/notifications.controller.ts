import { Controller } from '@nestjs/common';
import {  Get, Post, Body, Param, Delete, Put,UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { NotificationssSchema,NotificationsDocument } from './models/notifications.schema';
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}
    @Post()
      async create(@Body() noteData: CreateNotificationDto): Promise<NotificationsDocument> {
        return await this.notificationsService.create(noteData);
      }
    
    
      @Get()
      async findAll(): Promise<NotificationsDocument[]> {
        return await this.notificationsService.findAll();
      }
    
      @Get(':id')
      async findById(@Param('id') id: string): Promise<NotificationsDocument> {
        return await this.notificationsService.findById(id);
      }
}

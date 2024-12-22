import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  ForbiddenException
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDTO } from './dto/create-module.dto';
import { UpdateModuleDTO } from './dto/update-module.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as mongoose from 'mongoose';
import { multerConfig } from 'src/shared/m.config';
import { Express } from 'express';
import { User } from '../user/models/user.schema';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Course } from 'src/course/models/course.schema';
@UseGuards(AuthGuard, RolesGuard)
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

 

  @Post()
  @Roles(UserRole.Instructor) // Restrict access to only instructors
  @UseInterceptors(FilesInterceptor('mediaFiles', 10, {
    storage: diskStorage({
      destination: './uploads', // Save files to 'uploads' directory
      filename: (req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        callback(null, uniqueSuffix);
      },}),
    }),) // Allow up to 10 files
  create(
    @Body() createModuleDto: CreateModuleDTO, 
    @UploadedFiles() mediaFiles: Express.Multer.File[], 
    @CurrentUser() currentUser: User  & { userId: string }
  ) {
    
    createModuleDto.creator = new mongoose.Types.ObjectId(currentUser.userId);

    // Add media files to DTO if they exist
    if (mediaFiles) {
      createModuleDto.mediaFiles = mediaFiles.map(file => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      }));}
      console.log('Media Files:', mediaFiles);

  
    return this.moduleService.create(createModuleDto);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file); // Handle the uploaded file
    return { message: 'File uploaded successfully', file };
  }

  @Get()
  async findAll() {
    return await this.moduleService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.moduleService.findById(id);
  }
  
 


  @Put(':id')
  @Roles(UserRole.Admin, UserRole.Instructor)
  @UseInterceptors(FilesInterceptor('mediaFiles', 10))
  async update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDTO,
    @UploadedFiles() mediaFiles: Express.Multer.File[],
    @CurrentUser() currentUser: { userId: string }
  ) {
    const module = await this.moduleService.findById(id);
    
    // Check if the current user is the creator of the module
    if (module.creator.toString() !== currentUser.userId) {
      throw new ForbiddenException('You are not authorized to update this module');
    }
    if (mediaFiles) {
      updateModuleDto.mediaFiles = mediaFiles.map(file => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      }));}
    return await this.moduleService.update(id, updateModuleDto, currentUser.userId);
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.Instructor)
  async delete(@Param('id') id: string, @CurrentUser() currentUser: { userId: string }) {
    const module = await this.moduleService.findById(id);
    
    // Check if the current user is the creator of the module
    if (module.creator.toString() !== currentUser.userId) {
      throw new ForbiddenException('You are not authorized to delete this module');
    }
    return await this.moduleService.delete(id, currentUser.userId);
  }

  @Get('title/:title')
  async findByTitle(@Param('title') title: string) {
    return await this.moduleService.findByTitle(title);
  }
}

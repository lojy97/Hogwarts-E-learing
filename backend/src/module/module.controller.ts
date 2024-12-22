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
  ForbiddenException,
  UploadedFile
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
import { diskStorage } from 'multer';
import { Course } from 'src/course/models/course.schema';
@UseGuards(AuthGuard, RolesGuard)
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

 

  @Post()
<<<<<<< HEAD
<<<<<<< HEAD
  // Ensure the user is authenticated and has the appropriate role
=======
>>>>>>> master
  @Roles(UserRole.Instructor, UserRole.Admin)
  create(@Body() createModuleDto: CreateModuleDTO) {
=======
  @Roles(UserRole.Instructor) // Restrict access to only instructors
  @UseInterceptors(FilesInterceptor('mediaFiles')) // Allow up to 10 files
  create(
    @Body() createModuleDto: CreateModuleDTO, 
    @UploadedFiles() mediaFiles: Express.Multer.File[], 
    @CurrentUser() currentUser: User  & { userId: string }
  ) {
    
    createModuleDto.creator = new mongoose.Types.ObjectId(currentUser.userId);
    console.log(createModuleDto)
    
    // Add media files to DTO if they exist
    if (mediaFiles) {
      createModuleDto.mediaFiles = mediaFiles.map(file => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      }));}
      console.log('Media Files:', mediaFiles);

  
>>>>>>> master
    return this.moduleService.create(createModuleDto);
  }


  @Roles(UserRole.Instructor) // Restrict access to only instructors
  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  uploadFile(@UploadedFiles() file: Express.Multer.File) {
    console.log('ana henaaa')
    console.log(file); // Handle the uploaded file
    return file ;
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
<<<<<<< HEAD
<<<<<<< HEAD
  
=======
  @Roles(UserRole.Admin)
>>>>>>> master
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDTO) {
    return this.moduleService.update(id, updateModuleDto);
=======
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
>>>>>>> master
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
<<<<<<< HEAD
<<<<<<< HEAD

  
  
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moduleService.delete(id);
  }

  // Students can rate a module if they are enrolled in the course

  @Post(':id/rate')
  async rateModule(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Request() req: any,  // Get the user from the request object
  ) {
    const userId = req.user._id;  // The user ID is available in the request object after authentication

    // Call the service method to add the rating
    return this.moduleService.addRating(id, rating, userId);
}
=======
>>>>>>> master
}
=======

  @Get('title/:title')
  async findByTitle(@Param('title') title: string) {
    return await this.moduleService.findByTitle(title);
  }
  @Get('course/:courseid')
  findByCourseId(@Param('courseid') courseid: string) {
    return this.moduleService.findByCourse(courseid);
  }
}
>>>>>>> master

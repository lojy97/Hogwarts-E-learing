import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, NotFoundException, Request } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDTO } from './dto/create-module.dto';
import { UpdateModuleDTO } from './dto/update-module.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request as ExpressRequest } from 'express';
import { User } from '../user/models/user.schema';
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  // Only Instructors or Admins can create a module
  @Post()
  @UseGuards(AuthGuard, RolesGuard)  // Ensure the user is authenticated and has the appropriate role
  @Roles(UserRole.Instructor, UserRole.Admin)
  create(@Body() createModuleDto: CreateModuleDTO) {
    return this.moduleService.create(createModuleDto);
  }

  // Everyone can view all modules (public access)
  @Public()
  @Get()
  findAll() {
    return this.moduleService.findAll();
  }

  // Everyone can view a module by ID (public access)
  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.moduleService.findById(id);
  }

  // Only Admins can update a module
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDTO) {
    return this.moduleService.update(id, updateModuleDto);
  }

  // Search module by title (public)
  @Public()
  @Get('title/:title')
  async findModuleByTitle(@Param('title') title: string) {
    try {
      const module = await this.moduleService.findByTitle(title);
      return module;
    } catch (error) {
      throw new NotFoundException('Module not found');
    }
  }

  // Only Admins or Instructors can delete a module
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Instructor)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moduleService.delete(id);
  }

  // Students can rate a module if they are enrolled in the course
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Student) // Only students can rate modules
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
}
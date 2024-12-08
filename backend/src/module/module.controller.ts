import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDTO } from './dto/create-module.dto';
import { UpdateModuleDTO } from './dto/update-module.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request as ExpressRequest } from 'express';
import { User } from '../user/models/user.schema';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) { }

  // Only Instructors or Admins can create a module
  @Post()
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
  @Roles(UserRole.Admin)
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDTO) {
    return this.moduleService.update(id, updateModuleDto);
  }

  // Search module by title (public)
  @Public()
  @Get('title/:title')
  findByTitle(@Param('title') title: string) {
    return this.moduleService.findByTitle(title);
  }
}
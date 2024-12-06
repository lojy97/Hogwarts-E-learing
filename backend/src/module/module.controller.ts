import { Controller, Get, Post, Body, Param, Patch, Delete, Put, UseGuards  } from '@nestjs/common';
import { ModuleService } from './module.service';
import {CreateModuleDTO} from './dto/create-module.dto';
import {UpdateModuleDTO} from './dto/update-module.dto';
import { ModulesContainer } from '@nestjs/core';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';;

import { NotFoundException } from '@nestjs/common';
@UseGuards(RolesGuard)
    @Roles(UserRole.Instructor)
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  create(@Body() createModuleDto: CreateModuleDTO) {
    return this.moduleService.create(createModuleDto);
  }
@Public()
  @Get()
  findAll() {
    return this.moduleService.findAll();
  }
@Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.moduleService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDTO) {
    return this.moduleService.update(id, updateModuleDto);
  }
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
  @UseGuards(RolesGuard)
    @Roles(UserRole.Instructor)
    @Roles(UserRole.Admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moduleService.delete(id);
  }
}

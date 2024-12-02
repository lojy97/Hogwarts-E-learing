import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { ModuleService } from './module.service';
import {CreateModuleDTO} from './dto/create-module.dto';
import {UpdateModuleDTO} from './dto/update-module.dto';
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  create(@Body() createModuleDto: CreateModuleDTO) {
    return this.moduleService.create(createModuleDto);
  }

  @Get()
  findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.moduleService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDTO) {
    return this.moduleService.update(id, updateModuleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moduleService.delete(id);
  }
}

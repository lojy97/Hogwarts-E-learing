import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/creatresponse.dto';
import { UpdateResponseDto } from './dto/updateresponse.dto';
import { ModulesContainer } from '@nestjs/core';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { NotFoundException } from '@nestjs/common';


  
@Controller('responses')
export class ResponsesController {
    constructor(private readonly responsesService: ResponsesService) {}

  /*  @Post()
    @Roles(Roles.instructor) // Only students can create a response.
    async create(@Body() createResponseDto: CreateResponseDto) {
      return this.responsesService.create(createResponseDto);
    }*/
  
}


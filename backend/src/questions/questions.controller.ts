import { Body, Controller, Delete, Get, Param, Post, Put, Query, NotFoundException ,UseGuards} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { createQuestionDto } from './dto/createQuestion.dto';
import { updateQuestionDto } from './dto/updateQuestions.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { UserRole } from 'src/user/models/user.schema';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.Instructor, UserRole.Admin)
  @Post()
  async create(@Body() createDto: createQuestionDto) {
    return await this.questionsService.create(createDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.Instructor, UserRole.Admin)
  @Get()
  async getAll() {
    return await this.questionsService.findAll();
  }


  @Get(':id')
  async getById(@Param('id') id: string) {
    const question = await this.questionsService.findByID(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }


  @Get(':id/mcq/:index')
  async getMCQ(@Param('id') id: string, @Param('index') index: number) {
    const mcqQuestion = await this.questionsService.findInMCQ(id, index);
    if (!mcqQuestion) {
      throw new NotFoundException('MCQ not found');
    }
    return mcqQuestion;
  }

  
  @Get(':id/tf/:index')
  async getTF(@Param('id') id: string, @Param('index') index: number) {
    const tfQuestion = await this.questionsService.findInTF(id, index);
    if (!tfQuestion) {
      throw new NotFoundException('T/F question not found');
    }
    return tfQuestion;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.Instructor, UserRole.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: updateQuestionDto) {
    const updatedQuestion = await this.questionsService.update(id, updateDto);
    if (!updatedQuestion) {
      throw new NotFoundException('Question not found');
    }
    return updatedQuestion;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.Instructor, UserRole.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedQuestion = await this.questionsService.delete(id);
    if (!deletedQuestion) {
      throw new NotFoundException('Question not found');
    }
    return { message: 'Deleted successfully', data: deletedQuestion };
  }
}


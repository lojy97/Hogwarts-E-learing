import { Controller, Post, Body, Res, HttpStatus, HttpException, Query, Get, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUpDto';
import { SignInDto } from './dto/SignInDto';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/models/user.schema';
import { Roles } from './decorators/roles.decorator';
import { AuthGuard } from './guards/authentication.guard';
import { RolesGuard } from './guards/authorization.guard';
import { UserRole } from '../user/models/user.schema';
import { UseGuards } from '@nestjs/common';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    try {
      const result = await this.authService.register(signUpDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'An error occurred during registration',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(signInDto.email, signInDto.password);
      console.log('Generated Token:', result.access_token); // Log the token
      res.cookie('auth_token', result.access_token, { httpOnly: true });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('signout')
  async signout(@CurrentUser() currentUser: User, @Res() res: Response) {
    console.log('Signing out user:', currentUser); // Log the user ID
    res.clearCookie('auth_token');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Signout successful',
    });
  }



  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Query('userId') userId: string,
  ) {
    if (!token || !userId) {
      throw new BadRequestException('Token and userId are required');
    }
    return this.authService.verifyEmail(token, userId);
  }


  @Get('dummy')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Instructor, UserRole.Admin)
  dummyEndpoint() {
    return {
      message: 'This is a protected route for Instructors and Admins only',
    };
  }
}
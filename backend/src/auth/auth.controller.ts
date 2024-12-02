import { Body, Controller, HttpStatus, Post, Res, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint to handle user signup
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    try {
      // Call the register method from authService
      const message = await this.authService.register(signUpDto);
      return {
        statusCode: HttpStatus.CREATED,
        message,
      };
    } catch (error) {
      // Handle errors and send a standardized response
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Registration failed',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint to handle user login
  @Post('login')
  async login(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      // Call the signIn method from authService
      const { access_token, payload } = await this.authService.signIn(signInDto.email, signInDto.password);

      // Set the access token as a cookie
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        maxAge: 3600000, // 1 hour
      });

      // Send success response
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: payload,
      });
    } catch (error) {
      // Return error response
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Login failed',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

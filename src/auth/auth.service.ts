import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { SignInDto } from './dto/SignInDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // TO BE UPDATED WHEN ADDING THE USER SERVICE API METHODS
  /*
  async register(registerRequestDto: RegisterRequestDto) {
    const { email, password, ...rest } = registerRequestDto;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userService.create({
      ...rest,
      email,
      passwordHash: hashedPassword,
    });
    return newUser;
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { userId: user.userId, role: user.role };
    const access_token = this.jwtService.sign(payload, {
      secret: 'your_jwt_secret', // Replace with your actual JWT secret
      expiresIn: '3600s', // Replace with your actual expiration time
    });
    return {
      access_token,
      payload,
    };
  }
    */
}
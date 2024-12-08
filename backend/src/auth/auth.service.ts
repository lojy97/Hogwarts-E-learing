import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/SignUpDto';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUpDto: SignUpDto): Promise<string> {
    const { email, password, ...userData } = signUpDto;

    // Check if the user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await this.userService.create({
      ...userData,
      email,
      passwordHash: hashedPassword,
      courses: [],
      emailVerified: false,
    });

    return 'Registered successfully';
  }

  async signIn(email: string, password: string): Promise<{ access_token: string; payload: { userId: Types.ObjectId; role: string } }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log("User found: ", "Name: ", user.name, "Email: ", user.email, "Role: ", user.role);

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log("Password valid: ", isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user._id as Types.ObjectId, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload, { secret: 'your_jwt_secret' }), 
      payload,
    };
  }
}
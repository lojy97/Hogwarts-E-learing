import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/SignUpDto';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/user/models/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(signUpDto: SignUpDto): Promise<string> {
    const { email, password, ...userData } = signUpDto;

    // Check if user exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const tokendata = uuidv4();

    // Create user (with emailVerified: false and verificationToken)
    const createdUser = await this.userService.create({
      ...userData,
      email,
      passwordHash: hashedPassword,
      courses: [],
      emailVerified: false,
      token: tokendata, // Just the token string
    });

    
    // Send verification email
    await this.emailService.sendVerificationEmail(
      email,
      tokendata,
      createdUser._id.toString(),
    );

    return 'Registered successfully. Please check your email to verify your account.';
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    payload: { userId: Types.ObjectId; role: string };
  }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified.');
    }

    const payload = { userId: user._id as Types.ObjectId, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: 'your_jwt_secret',
      }),
      payload,
    };
  }

  async verifyEmail(token: string, userId: string): Promise<string> {
    const user = await this.userService.findById(userId);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.emailVerified) {
      return 'Email already verified';
    }
  
    // Check if token matches
    if (user.token !== token) {
      throw new BadRequestException('Invalid token');
    }
  
    // Update user as verified and set the token to 'verified'
    await this.userService.updateVerificationStatus(userId, true);
  
    return 'Email verified successfully';
  }
}
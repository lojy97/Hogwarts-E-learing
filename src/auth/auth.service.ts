import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  // Register a new user
  async register(signUpDto: SignUpDto): Promise<string> {
    const { email, password, ...userData } = signUpDto;

    // Check if the user already exists
    if (await this.userService.findByEmail(email)) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.create({
      ...userData,
      email,
      passwordHash: hashedPassword,
      courses: [], // Initialize as empty
    });

    return 'Registered successfully';
  }

  // Method to sign in a user
  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; payload: { userId: Types.ObjectId; role: string } }> {
    // Find the user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // If user is not found, throw an exception
      throw new NotFoundException('User not found');
    }
    console.log("User found: ", "Name: ", user.name, "Email: ", user.email, "Role: ", user.role);

    // Compare the provided password with the stored hashed password
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      // If passwords do not match, throw an exception
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create a payload with user ID and role
    const payload = { userId: user._id as Types.ObjectId, role: user.role };

    // Return the access token and payload
    return {
      access_token: this.jwtService.sign(payload),
      payload,
    };
  }
}

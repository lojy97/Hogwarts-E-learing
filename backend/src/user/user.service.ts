import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Inject the User model
    private jwtService: JwtService // Inject the JWT service
  ) {}

  // Create a new user
  async create(userData: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(userData);  // Create a new user document
    return await newUser.save();  // Save it to the database
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return await this.userModel.find();  // Fetch all users from the database
  }

  // Get a user by ID
  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);  // Fetch a user by ID
  }

  // Get a user by email
  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });  // Fetch a user by email
  }

  // Update a user's details by ID
  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });  // Find and update the user
  }

  // Delete a user by ID
  async delete(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);  // Find and delete the user
  }
}
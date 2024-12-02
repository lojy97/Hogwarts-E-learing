import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Inject the User model
  ) {}

  // Create a new user
  async create(userData: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(userData);  // Create a new user document
    return newUser.save();  // Save it to the database
  }

  // Get all users
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();  // Fetch all users from the database
  }

  // Get a user by ID
  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();  // Fetch a user by ID
  }

  // Get a user by email
  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();  // Fetch a user by email
  }

  // Update a user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();  // Update a user by ID
  }

  // Delete a user by ID
  async delete(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();  // Delete a user by ID
  }
}
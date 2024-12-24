import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRole } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { sendNotification } from 'firebase/send-firebase-notification';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Inject the User model
    private jwtService: JwtService // Inject the JWT service
  ) { }

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

  // Search for users by name
  async findByName(name: string): Promise<User[]> {
    return await this.userModel.find({ name: { $regex: name, $options: 'i' } }).exec();
  }

  // Search for instructors by name
  async findInstructorsByName(name: string): Promise<User[]> {
    return await this.userModel.find({
      name: { $regex: name, $options: 'i' },
      role: UserRole.Instructor,
    }).exec();
  }

  // Search for students by name
  async findStudentsByName(name: string): Promise<User[]> {
    return await this.userModel.find({
      name: { $regex: name, $options: 'i' },
      role: UserRole.Student,
    }).exec();
  }

  // Update a user's details by ID
  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    // To check if the user has enrolled or not
    let user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });  // Find and update the user
    let courseEnrolledNotification = {
      body: 'Course Enrolled Successfully',
      title: 'Mazzika Course',
      icon: 'https://shorturl.at/eZpGH',
      image: 'https://shorturl.at/qxV4w'
    }
    sendNotification(user.notificationToken, courseEnrolledNotification);
    return user;
  }

  // Delete a user by ID
  async delete(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);  // Find and delete the user
  }
  async saveUserToken(userId: string, notificationToken: string): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userModel.updateOne({ _id: userId }, { notificationToken });
    return;
  }

  // Check if a user has a course
  async hasCourse(userId: string, courseId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const courseIdString = courseId.toString();
    return user.courses.some(course => course.toString() === courseIdString);

  }

  // Update verification status of a user
  async updateVerificationStatus(id: string, status: boolean): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { emailVerified: status, token: status ? 'verified' : '' },
      { new: true }
    );
  }
  async findUsersByIds(userIds: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }
}

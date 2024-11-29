import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: mongoose.Model<User>, // Inject the User model
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

    // Update a user's details by ID
    async update(id: string, updateData: UpdateUserDto): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, updateData, { new: true });  // Find and update the user
    }

    // Delete a user by ID
    async delete(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id);  // Find and delete the user
    }

    // Login a user
    async login(loginData: LoginUserDto): Promise<string> {
        const { email, password } = loginData;
        const user = await this.userModel.findOne({ email });  // Find the user by email

        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid credentials');  // Throw an error if credentials are invalid
        }

        const payload = { userId: user._id, email: user.email };  // Create a JWT payload
        return this.jwtService.sign(payload);  // Sign and return the JWT token
    }
}
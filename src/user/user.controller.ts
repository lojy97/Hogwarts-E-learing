import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users') // it means anything starts with /users
export class UserController {
    constructor(private userService: UserService) { }
    // The UserService is injected through the class constructor.
    // Notice the use of the private syntax.
    // This shorthand allows us to both declare and initialize the userService member immediately in the same location.

    @Get()
    // Get all users
    async getAllUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(':id') // /users/:id
    // Get a single user by ID
    async getUserById(@Param('id') id: string): Promise<User> { // Get the user ID from the route parameters
        const user = await this.userService.findById(id);
        return user;
    }

    // Create a new user
    @Post()
    async createUser(@Body() userData: CreateUserDto): Promise<User> { // Get the new user data from the request body
        const newUser = await this.userService.create(userData);
        return newUser;
    }

    // Update a user's details
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
        const updatedUser = await this.userService.update(id, userData);
        return updatedUser;
    }

    // Delete a user by ID
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<User> {
        const deletedUser = await this.userService.delete(id);
        return deletedUser;
    }
}
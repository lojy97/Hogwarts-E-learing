import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';


@UseGuards(AuthGuard)
@Controller('users') // it means anything starts with /users
export class UserController {
    constructor(private userService: UserService) { }

    @Public()
    @Get()
    // Get all users
    async getAllUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get('currentUser')
    async getCurrentUser(@Req() { user }): Promise<User> {
        const currentUser = await this.userService.findById(user.userId);
        console.log(currentUser);
        return currentUser;
    }

    @Get(':id') // /users/:id
    // Get a single user by ID
    async getUserById(@Param('id') id: string): Promise<User> {
        const user = await this.userService.findById(id);
        return user;
    }

    @Post()
    // Create a new user
    async createUser(@Body() userData: CreateUserDto): Promise<User> {
        const newUser = await this.userService.create(userData);
        return newUser;
    }

    @Put(':id')
    // Update a user's details
    async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
        const updatedUser = await this.userService.update(id, userData);
        return updatedUser;
    }

    @UseGuards(RolesGuard) 
    @Roles(UserRole.Admin)
    @Delete(':id')
    // Delete a user by ID
    async deleteUser(@Param('id') id: string): Promise<User> {
        const deletedUser = await this.userService.delete(id);
        return deletedUser;
    }
}
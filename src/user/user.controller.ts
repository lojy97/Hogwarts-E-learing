import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';

// Apply the AuthGuard globally to all routes in this controller
@UseGuards(AuthGuard)
@Controller('users') // Prefix all routes with /users
export class UserController {
    constructor(private userService: UserService) { }

    // Public route to get all users
    @Public()
    @Get()
    async getAllUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    // Route to get the current authenticated user
    @Get('currentUser')
    async getCurrentUser(@Req() { user }): Promise<User> {
        const currentUser = await this.userService.findById(user.userId);
        console.log(currentUser);
        return currentUser;
    }

    // Route to get a single user by ID
    @Get(':id') // /users/:id
    async getUserById(@Param('id') id: string): Promise<User> {
        const user = await this.userService.findById(id);
        return user;
    }

    // Route to create a new user
    @Public()
    @Post()
    async createUser(@Body() userData: CreateUserDto): Promise<User> {
        const newUser = await this.userService.create(userData);
        return newUser;
    }

    // Route to update a user's details by ID
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
        const updatedUser = await this.userService.update(id, userData);
        return updatedUser;
    }

    // Route to delete a user by ID, restricted to admin users
    @UseGuards(RolesGuard)
    @Roles(UserRole.Admin)
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<User> {
        const deletedUser = await this.userService.delete(id);
        return deletedUser;
    }

    // Public route to login a user
    @Public()
    @Post('login')
    async loginUser(@Body() loginData: LoginUserDto): Promise<{ accessToken: string }> {
        const accessToken = await this.userService.login(loginData);
        return { accessToken };
    }
}
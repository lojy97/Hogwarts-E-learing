import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put, 
    Req, 
    UseGuards 
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { User } from './models/user.schema';
  import { CreateUserDto } from './dto/createUser.dto';
  import { UpdateUserDto } from './dto/updateUser.dto';
  import { Public } from 'src/auth/decorators/public.decorator';
  import { Roles } from 'src/auth/decorators/roles.decorator';
  import { UserRole } from './models/user.schema';
  import { RolesGuard } from 'src/auth/guards/authorization.guard';
  import { AuthGuard } from 'src/auth/guards/authentication.guard';
  
  @UseGuards(AuthGuard) // Globally apply the AuthGuard to all routes
  
  @Controller('users') // Prefix all routes with /users
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    // Public route to fetch all users
    @Public()
    @Get()
    async getAllUsers(): Promise<User[]> {
      return this.userService.findAll();
    }
  
    // Route to fetch the currently authenticated user
    @Get('current')
    async getCurrentUser(@Req() { user }): Promise<User> {
      return this.userService.findById(user.userId);
    }
  
    // Route to fetch a user by ID
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<User> {
      return this.userService.findById(id);
    }
  
    // Public route to create a new user
    @Public()
    @Post()
    async createUser(@Body() userData: CreateUserDto): Promise<User> {
      return this.userService.create(userData);
    }
  
    // Route to update a user by ID
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
      return this.userService.update(id, userData);
    }
  
    // Admin-only route to delete a user by ID
    @UseGuards(RolesGuard)
    @Roles(UserRole.Admin)
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<User> {
      return this.userService.delete(id);
    }
  }
  
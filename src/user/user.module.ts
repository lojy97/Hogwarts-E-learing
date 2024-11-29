import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/authentication.guard';

@Module({
  // Import the MongooseModule and define the User schema
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  
  // Provide the UserService and apply the AuthGuard globally to all routes
  providers: [
    UserService,
    {
      provide: APP_GUARD, // Apply guard globally to all routes instead of specifying one by one
      useClass: AuthGuard,
    },
  ],
  
  // Define the UserController
  controllers: [UserController]
})
export class UserModule {}
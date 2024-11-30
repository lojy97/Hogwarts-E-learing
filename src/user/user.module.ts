import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema';

@Module({
  // Import the MongooseModule and define the User schema
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],

  
  // Provide the UserService
  providers: [UserService],
  
  // Define the UserController
  controllers: [UserController]
  
  exports: [UserService, MongooseModule],

})
export class UserModule {}
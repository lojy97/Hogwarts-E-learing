import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.schema';

@Module({
  // Import the MongooseModule and define the User schema
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  
  // Provide the UserService
  providers: [UserService],
  
  // Define the UserController
  controllers: [UserController],
  
  // Export UserService to be used in other modules
  exports: [UserService],
})
export class UserModule {}
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema';
import { AuthenticationMiddleware } from 'src/auth/middleware/authentication.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/authentication.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserService,{
         provide: APP_GUARD, // to apply guard globally to all routes instead of specifying one by one
        useClass: AuthGuard,
      },],
  controllers: [UserController]
})
export class UserModule {}

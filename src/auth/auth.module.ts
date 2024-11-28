import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'your_jwt_secret', // Replace with your actual JWT secret
      signOptions: { expiresIn: '3600s' }, // Replace with your actual expiration time
    }),
  ],
})
export class AuthModule {}
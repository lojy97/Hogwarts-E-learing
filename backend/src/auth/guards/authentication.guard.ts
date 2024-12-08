import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    console.log('Extracted Token:', token); // Log the token
    if (!token) {
      throw new UnauthorizedException('No token, please login');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'your_jwt_secret', // Ensure the secret is the same
      });
      request['user'] = payload;
    } catch (err) {
      console.error('Token verification error:', err); // Log the error
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.auth_token;
  }
}
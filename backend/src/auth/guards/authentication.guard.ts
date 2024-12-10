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

  // Method to determine if a request can proceed
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Allow access to public routes
    }

    // Get the request object
    const request = context.switchToHttp().getRequest<Request>();
    // Extract the token from cookies
    const token = this.extractTokenFromCookie(request);
    console.log('Extracted Token:', token); // Log the token for debugging
    if (!token) {
      throw new UnauthorizedException('No token, please login'); // Throw error if no token is found
    }

    try {
      // Verify the token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'your_jwt_secret', // Ensure the secret is the same as used in token generation
      });
      // Set the user object on the request
      request['user'] = payload;
    } catch (err) {
      console.error('Token verification error:', err); // Log the error for debugging
      throw new UnauthorizedException('Invalid token'); // Throw error if token verification fails
    }

    return true; // Allow the request to proceed
  }

  // Helper method to extract token from cookies
  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.auth_token; // Return the token if it exists in cookies
  }
}
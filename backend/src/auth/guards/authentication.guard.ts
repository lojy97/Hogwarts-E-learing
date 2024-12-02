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
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    // Method to determine if a request can proceed
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if the route is public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            // If the route is public, allow access
            return true;
        }

        // Get the request object
        const request = context.switchToHttp().getRequest<Request>();
        // Extract the token from the request
        const token = this.extractTokenFromRequest(request);
        if (!token) {
            // If no token is found, throw an unauthorized exception
            throw new UnauthorizedException('No token, please login');
        }

        try {
            // Verify the token
            const payload = await this.jwtService.verifyAsync(token);
            // Attach the payload to the request object
            request['user'] = payload;
        } catch {
            // If token verification fails, throw an unauthorized exception
            throw new UnauthorizedException('Invalid token');
        }

        // Allow access
        return true;
    }

    // Helper method to extract token from the request
    private extractTokenFromRequest(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            // Return the token part of the authorization header
            return authHeader.split(' ')[1];
        }

        if (request.cookies && request.cookies.access_token) {
            return request.cookies.access_token;
        }

        // If no token is found, return null
        return null;
    }
}
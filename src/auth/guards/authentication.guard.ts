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

    // Method to determine if the request can proceed
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if the route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true; // Allow public routes to proceed
        }

        // Extract the request object
        const request = context.switchToHttp().getRequest<Request>();
        // Extract the token from the request header
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('No token, please login'); // Throw an error if no token is found
        }

        try {
            // Verify the token
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: 'your_jwt_secret' // Replace with your actual JWT secret
                }
            );
            // Attach the payload to the request object
            request['user'] = payload;
        } catch (err) {
            throw new UnauthorizedException('Invalid token'); // Throw an error if the token is invalid
        }

        return true; // Allow the request to proceed
    }

    // Helper method to extract the token from the request header
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined; // Return the token if the type is 'Bearer'
    }
}
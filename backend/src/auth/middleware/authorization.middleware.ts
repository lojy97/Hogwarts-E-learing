import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

// Middleware function to authorize requests
export function AuthorizationMiddleware(req: Request, res: Response, next: NextFunction) {
    // Extract the token from cookies or the Authorization header
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    // If no token is found, throw an UnauthorizedException
    if (!token) {
        throw new UnauthorizedException('Authentication token missing');
    }

    try {
        // Verify the token using the JWT secret
        const decoded: any = verify(token, 'your_jwt_secret'); // Replace with your actual JWT secret
        // Attach the user payload to the request object
        req['user'] = decoded.user;
        // Allow the request to proceed
        next();
    } catch (err) {
        // If the token is invalid or expired, throw an UnauthorizedException
        throw new UnauthorizedException('Invalid or expired token');
    }
}
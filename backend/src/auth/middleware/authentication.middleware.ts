import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../user/models/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name); // Logger instance for logging

  constructor(private reflector: Reflector) {}

  // Method to determine if the request can proceed
  canActivate(context: ExecutionContext): boolean {
    // Get the required roles for the route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Allow access if no roles are required
    }

    // Extract the request object
    const request = context.switchToHttp().getRequest();
    // Extract the user from the request object
    const user = request.user;

    if (!user) {
      this.logger.warn('No user attached to the request'); // Log a warning if no user is attached
      throw new UnauthorizedException('No user attached to the request'); // Throw an error if no user is attached
    }

    // Get the user's role
    const userRole = user.role;
    // Check if the user's role is included in the required roles
    if (!requiredRoles.includes(userRole)) {
      this.logger.warn(`User with role ${userRole} is not authorized to access this resource`); // Log a warning if the user is not authorized
      throw new UnauthorizedException('Unauthorized access'); // Throw an error if the user is not authorized
    }

    return true; // Allow the request to proceed
  }
}
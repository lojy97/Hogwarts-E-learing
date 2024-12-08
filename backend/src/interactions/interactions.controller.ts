import { Controller } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
@Controller('interactions')
export class InteractionsController {}

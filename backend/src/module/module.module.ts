import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { Module as ModuleEntity, ModuleSchema } from './models/module.schema';
import { UserModule } from 'src/user/user.module';  // Import UserModule
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModuleEntity.name, schema: ModuleSchema }]),
    UserModule,  
    AuthModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [MongooseModule],
})
export class ModuleModule {}

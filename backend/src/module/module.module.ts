import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { Module as ModuleEntity, ModuleSchema } from './models/module.schema';
import { UserModule } from 'src/user/user.module';  // Import UserModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModuleEntity.name, schema: ModuleSchema }]),
    UserModule,  
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [MongooseModule],
})
export class ModuleModule {}

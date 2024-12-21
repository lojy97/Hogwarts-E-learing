import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { Module as ModuleEntity, ModuleSchema } from './models/module.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from '../auth/auth.module';
import { diskStorage } from 'multer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModuleEntity.name, schema: ModuleSchema },
    ]),
    UserModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Folder where files will be saved
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [MongooseModule],
})
export class ModuleModule {}
